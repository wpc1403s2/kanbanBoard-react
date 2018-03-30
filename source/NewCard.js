import React, {Component} from "react";
import PropTypes from "prop-types";
import CardForm from './CardForm';

class NewCard extends Component {
    //组件渲染前执行
    componentWillMount() {
        this.setState({
            id: Date.now(),
            title: '',
            description: '',
            status: 'todo',
            color: '#c9c9c9',
            tasks:[]
        });
    }

    //[]作用？？？
    handleChange(field, value) {
        this.setState({[field]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.cardCallbacks.addCard(this.state);
        this.props.history.pushState(null, '/');
    }

    handleClose(e) {
        this.props.history.pushState(null, '/');
    }

    render() {

        return (
          <CardForm draftCard={this.state}
                    buttonLabel="创建"
                    handleChange={this.handleChange.bind(this)}
                    handleClose={this.handleClose.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
          />
        );
    }
}

NewCard.propTypes={
    cardCallbacks:PropTypes.object
};
export default NewCard;