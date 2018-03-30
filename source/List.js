import React, {Component} from "react";
import PropTypes from 'prop-types';
import Card from "./Card";
import {DropTarget} from 'react-dnd';
import constants from './constants';

const listTargetSpec={
    hover(props,monitor) {
        //获取拖动的card
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateStatus(draggedId,props.id)
    }
}

function collect(connect,monitor){
    return {
        connectDropTarget:connect.dropTarget()
    }
}
class List extends Component {
    render() {
        /*
        * 父组件 <List id='todo' title="To Do" cards={...}/>
        * this.props {title:'TO Do' ,cards:[{
        *                id:2,
                        title:'写代码',
                        description:"动手写书里的demo",
                        status:'todo',
                        tasks:[
                            {
                                id:1,
                                name:'联系人列表',
                                done:true
                            },
                            {
                                id:2,
                                name:'看板示例',
                                done:false
                            },
                            {
                                id:3,
                                name:'写一个评论组件',
                                done:false
                            }
                        ]
                        },
                        {
                                id:3,
                                title:'玩游戏',
                                description:'玩半个小时的Pit people',
                                status:'todo',
                                tasks:[
                                    {
                                        id:1,
                                        name:'招募战士',
                                        done:false
                                    }
                                ]
    }
                        }
                        ]
        * */
        const {connectDropTarget} = this.props;
        let cards = this.props.cards.map((card) => {
            return <Card
              taskCallbacks={this.props.taskCallbacks}
              cardCallbacks={this.props.cardCallbacks}
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              color={card.color}
              tasks={card.tasks}/>
        });
        let myTitle;
        switch (this.props.title)
        {
            case "To Do":
                myTitle="待办";
                break;
            case "In progress":
                myTitle="进行中";
                break;
            case 'Done':
                myTitle="已完成";
                break;
            default:
                myTitle = '';

        }



        return connectDropTarget(
          <div className="list">
              <h1>{myTitle}</h1>
              {cards}
          </div>
        );
    }
}

List.propTypes = {
    title: PropTypes.string.isRequired,
    card: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
    connectDropTarget:PropTypes.func.isRequired,

};

export default DropTarget(constants.CARD,listTargetSpec,collect)(List);