import React, {Component} from "react";
import KanbanBoard from "./KanbanBoard";
import update from "react-addons-update";
import 'whatwg-fetch';
import 'babel-polyfill';
import {throttle} from './utils';
import dragDropHighOrderCard from "./Card";


const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'wpc1403s2'
};


class KanbanBoardContainer extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            cards: []
        };
        
        //当参数变化时触发
        this.updateCardStatus = throttle(this.updateCardStatus.bind(this));

        //当参数变化时500ms触发一次
        this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);

    }


    //会被调用一次 在初始化渲染之后立即被调用 在这个时间点 组件有一个可被访问的DOM内容
    componentWillMount() {
        fetch(API_URL + '/cards', {headers: API_HEADERS})
          .then((response) => {
              const data = response.json();
              return data;
          })
          .then(responseData => {
              this.setState({cards: responseData});
          })
          .catch((error) => {
              console.log("fatch 请求错误" + error);
          })
    }



    addTask(cardId, taskName) {
        let prevState = this.state;
        let CardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let newTask = {id: Date.now(), name: taskName, done: false};
        let nextState = update(this.state.cards, {
            [CardIndex]: {
                tasks: {$push: [newTask]}
            }
        });
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Server response wasn't OK")
              } else {
                  return response.json();
              }
          })
          .then((responseData) => {
              newTask.id = responseData.id;
              this.setState({cards: nextState});
          }).catch((error) => {
            console.error("Fetch error:", error);
            this.setState(prevState)
        })

    }

    deleteTask(cardId, taskId, taskIndex) {
        let prevState = this.state;

        //1 根据cardId 找到在原始cards里的索引
        let CardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        //2 根据索引 删除元素
        let nextState = update(this.state.cards, {
            [CardIndex]: {
                tasks: {$splice: [[taskIndex, 1]]}
            }
        })
        //更新state
        this.setState({cards: nextState});
        //3 向服务器发送删除请求
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'delete',
            headers: API_HEADERS
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Server response wasn't OK")
            }
        }).catch((error) => {
            console.error("Fetch error:", error);
            this.setState(prevState)
        });

    }

    toggleTask(cardId, taskId, taskIndex) {
        let prevState = this.state;
        let CardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let newDoneValue;
        let nextState = update(this.state.cards, {
            [CardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {
                            $apply: (done) => {
                                newDoneValue = !done;
                                return newDoneValue;
                            }
                        }
                    }
                }
            }
        })

        this.setState({cards: nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            //对象转为json
            body: JSON.stringify({done: newDoneValue})
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Server response wasn't OK")
            }
        }).catch((error) => {
            console.error("Fetch error:", error);
            this.setState(prevState)
        })

        ;

    }

    //更新card内部状态即status的值
    updateCardStatus(cardId, listId) {
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        //获取card
        let card = this.state.cards[cardIndex];
        //当拖动到不同的list时触发 "status":"todo"
        if (card.status !== listId) {
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: {$set: listId}
                    }
                }
            }));
        }
    }

    updateCardPosition(cardId, afterId) {
        //当拖动到不同的card时触发
        if (cardId !== afterId) {
            let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
            let card = this.state.cards[cardIndex];
            let afterIndex = this.state.cards.findIndex((card) => card.id == afterId);
            //插入到后一个card
            this.setState(update(this.state, {
                cards: {
                    $splice: [
                        //删除
                        [cardIndex, 1],
                        //插入
                        [afterIndex, 0, card]

                    ]
                }
            }));
        }
    }
    //把修改通知服务器
    persistCardDrag (cardId,status){
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let card = this.state.cards[cardIndex];
        fetch(`${API_URL}/cards/${cardId}`, {
            method: 'put',
            headers:API_HEADERS,
            body:JSON.stringify({status:card.status,row_order_position:cardIndex})
        }).then((response)=>{
            if(!response.ok){
                throw new Error("server response wasn't ok");
            }
        }).catch((error)=>{
            console.error("fetch error",error);
            this.setState(
              update(this.state,{
                  cards:{
                      [cardIndex]:{
                          status:{$set:status}
                      }
                  }
              })
            )
        });


    }

    //添加项目
    addCard(card){
        //用于回滚
        let prevState=this.state;

        if(card.id===null){
            card = Object.assign({}, card, {id: Date.now()});
        }


        //更新state
        let nextState = update(this.state.cards, {$push: [card]});
        this.setState({cards: nextState});

        //向服务器提交更改
        fetch(`${API_URL}/cards`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(card)
        }).then((response)=>{
            if(response.ok){
                return response.json();
            }else{
                throw new Error("服务器响应失败")
            }

        }).then((responseDate)=>{
            //更改本地state
            card.id=responseDate.id;
            this.setState({cards: nextState});
        }).catch((error)=>{
            //出错是回滚
            this.setState(prevState);
        })

    }

    //编辑后更新card
    updateCard(card){
        let prevState=this.state;
        //找到card的索引
        let cardIndex = this.state.cards.findIndex((c) => c.id == card.id);
        let nextState = update(this.state.cards, {
            [cardIndex]: {$set: card}
        });
        this.setState({cards: nextState});
        fetch(`${API_URL}/cards/${card.id}`, {
            method: 'put',
            headers:API_HEADERS,
            body: JSON.stringify(card),
        }).then((response)=>{
            if(!response.ok){
                throw new Error("服务器请求失败");
            }
        })
    }


    render() {
        //克隆props.children 并将卡片列表和回调函数作为props传入

        let kanbanBoard = this.props.children && React.cloneElement(
          this.props.children, {
              cards: this.state.cards,
              taskCallbacks: {
                  toggle: this.toggleTask.bind(this),
                  delete: this.deleteTask.bind(this),
                  add: this.addTask.bind(this)
              },
              cardCallbacks: {
                  addCard: this.addCard.bind(this),
                  updateCard:this.updateCard.bind(this),
                  updateStatus: this.updateCardStatus,
                  updatePosition: this.updateCardPosition,
                  persistCardDrag: this.persistCardDrag.bind(this),
              }
          }
        );


        return kanbanBoard;
    }

}
export default KanbanBoardContainer;