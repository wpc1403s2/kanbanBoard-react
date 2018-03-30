import React, {Component} from "react";
import PropTypes from "prop-types";

class CardForm extends Component {

    //处理表单域变更及提交 获取改变后的值
    handleChange(flield, e) {
        this.props.handleChange(flield, e.target.value);
    }

    handleClose(e) {
        e.preventDefault();
        this.props.handleClose();
    }

    render() {
        return (
          <div>
              {/*form 表单-------------start*/}
              <div className="card big">
                  <form onSubmit={this.props.handleSubmit.bind(this)}>
                      <input type="text"
                             value={this.props.draftCard.title}
                             onChange={this.handleChange.bind(this,'title')}
                             placeholder="请输入标题"
                             required={true}
                             autoFocus={true}
                      />
                      <br/>
                      <textarea value={this.props.draftCard.description}
                                onChange={this.handleChange.bind(this,"description")}
                                placeholder="请输入描述"
                                required={true}
                      />

                      <label htmlFor="status">状态</label>
                      <select name="" id="status"
                              value={this.props.draftCard.status}
                              onChange={this.handleChange.bind(this,'status')}
                      >
                          <option value="todo">待办</option>
                          <option value="in-progress">进行中</option>
                          <option value="done">已完成</option>
                      </select>
                      <br/>
                      <label htmlFor="color">颜色</label>
                      <input type="color"
                             id="color"
                             value={this.props.draftCard.color}
                             onChange={this.handleChange.bind(this,'color')}
                             defaultValue="#ff0000"/>
                      <div className="actions">
                          <button type="submit">
                              {this.props.buttonLabel}

                          </button>
                      </div>
                  </form>

              </div>
              {/*form 表单-------------end*/}

              {/*遮罩层*/}
              <div className="overlay" onClick={this.handleClose.bind(this)}></div>
          </div>
        );
    }
}

CardForm.propTypes={
    buttonLabel:PropTypes.string.isRequired,
    draftCard:PropTypes.shape({
        title:PropTypes.string,
        description:PropTypes.string,
        status:PropTypes.string,
        color:PropTypes.string,
    }).isRequired,
    handleChange:PropTypes.func.isRequired,
    handleSubmit:PropTypes.func.isRequired,
    handleClose:PropTypes.func.isRequired,

}
export default CardForm;