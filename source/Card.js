import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CheckList from "./CheckList";
import marked from "marked";
import ReactCSSTransitonGroup from "react-addons-css-transition-group";
import {DragSource, DropTarget} from 'react-dnd';
import constants from './constants';
import {Link} from 'react-router';


let titlePropTypes = (props, propName, componentName) => {
    if (props[propName]) {
        let value = props[propName];
        if (typeof value !== "string" || value.length > 80) {
            return new Error(
              `${propName} in ${componentName} is longer then 80 characters`
            )
        }
    }
}

//拖动源 说明
const cardDragSpec = {
    beginDrag(props) {
        return {
            id: props.id,
            status: props.status,
        };
    },
    endDrag(props) {
        props.cardCallbacks.persistCardDrag(props.id, props, status);
    }
};

//cardDropSpec spec对象描述放置对象是如何响应拖拽和放置事件
const cardDropSpec = {
    hover(props, monitor) {
        //拖动来的元素id
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updatePosition(draggedId, props.id);
    }
}


//collect 函数控制哪些属性注入到props

let collectDrag = (connect, monitor) => {
    return {
        //通过connect参数 向props注入属性connectDragSource 该属性用于
        //渲染是界定组件DOM的范围。dragSource组件 这部分DOM用来在拖拽过程对组件的呈现
        connectDragSource: connect.dragSource()
    };
}

let collectDrop = (connect, monitor) => {
    return {
        //通过connect参数 向props注入属性connectDragSource 该属性用于
        //渲染是界定组件DOM的范围。dragSource组件 这部分DOM用来在拖拽过程对组件的呈现
        connectDropTarget: connect.dropTarget()
    };
}

class Card extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showDetails: false
        }
    }

    //切换列表显示
    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails})
    }

    render() {
        const {connectDragSource, connectDropTarget} = this.props;
        let cardDetails;
        if (this.state.showDetails) {
            cardDetails = (
              <div className="card__details">
               <span dangerouslySetInnerHTML={{
                   __html: marked(this.props.description)
               }}/>
                  <CheckList cardId={this.props.id}
                             tasks={this.props.tasks}
                             taskCallbacks={this.props.taskCallbacks}
                  />
              </div>
            )
        }

        let sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        }

        /*
        * this.props   {
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
                        }
        *
        *
        * */
        return connectDropTarget(connectDragSource(
          <div className="card">
              <div style={sideColor}/>
              <div className="card__edit"><Link to={`/edit/`+this.props.id}>✎</Link></div>
              <div className={
                  this.state.showDetails ? "card__title card__title--is-open" :
                    "card__title"
              }
                   onClick={this.toggleDetails.bind(this)}
              >{this.props.title}</div>
              <ReactCSSTransitonGroup transitionName="toggle"
                                      transitionEnterTimeout={250}
                                      transitionLeaveTimeout={250}
              >
                  {cardDetails}
              </ReactCSSTransitonGroup>
          </div>
        ));
    }
}

Card.propTypes = {
    id: PropTypes.number,
    title: titlePropTypes,
    description: PropTypes.string,
    color: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
};
const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(Card);
const dragDropHighOrderCard = DropTarget(constants.CARD, cardDropSpec, collectDrop)(dragHighOrderCard);

export default dragDropHighOrderCard;
