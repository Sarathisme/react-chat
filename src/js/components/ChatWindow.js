import React, { Component } from 'react';
import '../../css/ChatWindow.css';
import { withCookies } from "react-cookie";

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
                <div className="navbar-brand">
                    <img className="profile-image" src={this.props.photo} width="40" height="40" alt="Profile"/>
                </div>
                <p className="profile-name">{this.props.name}</p>
            </div>

        );
    }
}

class Message extends Component {
    render() {
        return (
          <li className="message-li">
              <div className="message-li-div" id={this.props.direction}>
                  <span className="message-text">
                      {this.props.text}
                  </span>
              </div>
          </li>
        );
    }

}

class MessageList extends Component {
    render() {
        return(
            <div className="messages">
                {/*<ul className="message-ul"> {*/}
                    {/*JSON.parse(this.props.data).map(data =>*/}
                        {/*<Message id={this.props.direction} text={this.props.text} />*/}
                {/*)}*/}
                {/*</ul>*/}
            </div>
        );
    }
}

class ChatWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'interlocuter': this.props.interlocuter,
            'data': ''
        };

        this.onSendMessage = this.onSendMessage.bind(this);
    }

    onSendMessage() {

    }

    render() {
        let header;

        if(this.props.data === undefined) {
            header = <Header photo={'https://placeimg.com/50/50/any'} name={"John Doe"}/>;
        } else {
            header = <Header photo={JSON.parse(this.props.data).user.photo} name={JSON.parse(this.props.data).user.name}/>
        }

        return (
            <div className="chat-content">
                {header}
                <MessageList data={this.state.data}/>
                <MessageInput onSubmit={this.onSendMessage}/>
            </div>
        );
    }
}

class MessageInput extends Component {
    render() {
        return (
            <div className="message-bar">
                <input className="form-control message" placeholder="Enter message" onSubmit={this.props.onSendMessage}/>
            </div>
        );
    }
}

export default withCookies(ChatWindow);