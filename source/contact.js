/*
 *联系人应用程序
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import 'whatwg-fetch';

//顶层组件 获取contact 传入ContactApp
class ContactsAppContainer extends Component {
    constructor(){
        super();
        this.state = {
            contacts: []
        };
    }
    render() {
        return (
          <ContactsApp contacts={this.state.contacts}/>
        );
    }
    componentDidMount(){
        fetch("./contacts.json")
          .then((response)=>{
              // console.log("response: "+response);
              // var json = response.json();
              return response.json()

          })
          .then((responseData)=>{
              console.log("responseData: "+responseData);
              this.setState({contacts: responseData});
          })
          .catch((error)=>{
              new Error("Error fetching")
          })
    }
}

class ContactsApp extends Component {
    constructor() {
        super()
        this.state = {
            filterText: ''
        };
    }



    handleUserInput(searchTerm) {
        this.setState({filterText: searchTerm});
    }

    render() {
        return (
          <div>
              <SearchBar filterText={this.state.filterText}
                         onUserInput={this.handleUserInput.bind(this)}
              />
              <ContactList contacts={this.props.contacts}
                           filterText={this.state.filterText}
              />
          </div>

        );
    }
}

ContactsApp.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
};

//接受来自父组件的两个prop 1.filterText（string）2.onUserInput (callback)

class SearchBar extends Component {
    handleChange(event) {
        //触发回调函数 执行this.setState({filterText: searchTerm});
        this.props.onUserInput(event.target.value);
    }

    render() {
        return (
          <input type="search"
                 placeholder="输入姓名搜索"
                 value={this.props.filterText}
                 onChange={this.handleChange.bind(this)}
          />
        );
    }
}

SearchBar.propTypes = {
    onUserInput: PropTypes.func.isRequired,
    filterText: PropTypes.string.isRequired
};

//接受父组件传入的 contacts（数据） filterText（过滤）
class ContactList extends Component {
    render() {
        let filteredContacts = this.props.contacts.filter(
          (contacts) => contacts.name.indexOf(this.props.filterText) !== -1
        );

        return (
          <ul>
              {filteredContacts.map(
                (contact) => <ContactItem key={contact.phoneNumber}
                                          name={contact.name}
                                          phoneNumber={contact.phoneNumber}/>
              )}
          </ul>
        )
    }
}

ContactList.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object),
    filterText: PropTypes.string.isRequired
};

class ContactItem extends Component {
    render() {
        return (
          <li>
              {this.props.name}--{this.props.phoneNumber}
          </li>
        )
    }
}

ContactItem.propTypes = {
    name: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
};


ReactDOM.render(<ContactsAppContainer/>, document.getElementById("contact"));


