import React, {Component} from "react";
import PropTypes from "prop-types";
import CardForm from './CardForm';

class EditCard extends Component {
    componentWillMount(){
        let card = this.props.cards.find((card) => card.id == this.props.params.card_id);
        this.setState(Object.assign({}, card));

    }

    handleChange(field,value){

        this.setState({[field]: value});
    }

    handleSumit(e){
        e.preventDefault();
        this.props.cardCallbacks.updateCard(this.state);
        this.props.history.pushState(null, '/');
    }

    handleClose(e){
        this.props.history.pushState(null, '/');
    }

    render() {
        return (
          <CardForm draftCard={this.state}
                    buttonLabel="提交"
                    handleSubmit={this.handleSumit.bind(this)}
                    handleClose={this.handleClose.bind(this)}
                    handleChange={this.handleChange.bind(this)}
          />
        );
    }
}

EditCard.propTypes={
    cardCallbacks:PropTypes.object,
};

export default EditCard;
