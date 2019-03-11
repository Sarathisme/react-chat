import React, { Component } from 'react';
import '../../css/ChatWindow.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'photo': this.props.photo,
            'name': this.props.name
        }
    }

    render() {
        return (
            <div className="profile">
                <a className="navbar-brand" href="#">
                    <img className="profile-image" src={this.state.photo} width="40" height="40" alt="Profile image"/>
                </a>
                <p className="profile-name">{this.state.name}</p>
            </div>

        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <li className="message-li">
              <div className="message-li-div" id={this.props.id}>
                  <span className="message-text">
                      Hey!
                  </span>
              </div>
          </li>
        );
    }

}

class MessageList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="messages">
                <ul className="message-ul">
                    <Message id={"left"}/>
                    <Message id={"right"}/>
                    <Message id={"left"}/>
                </ul>
            </div>
        );
    }
}

class ChatWindow extends Component {
    constructor(props) {
        super(props);

        this.onSendMessage = this.onSendMessage.bind(this);
    }

    onSendMessage() {
        console.log("Message sent!");
    }

    render() {
        return (
            <div className="chat-content">

                <Header photo={'https://placeimg.com/50/50/any'} name={"John Doe"}/>
                <MessageList />
                <MessageInput onSubmit={this.onSendMessage}/>

            </div>
        );
    }
}

class MessageInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="message-bar">
                <input className="form-control message" placeholder="Enter message" onSubmit={this.props.onSendMessage}/>
            </div>
        );
    }
}

export default ChatWindow;