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

    getDirection(value) {
        if(value === this.props.user_id) {
            return "right";
        } else {
            return "left";
        }
    }

    render() {
        let messages;

        if(this.props.chats.length === 0) {
            messages = <ul className="message-ul"/>;
        } else {
            messages = <ul className="message-ul">
                {this.props.chats.map(data => <Message direction={this.getDirection(data.id)} text={data.message} /> )}
            </ul>;
        }
        return(
            <div className="messages">
                {messages}
            </div>
        );
    }
}

class ChatWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'interlocuter': this.props.interlocuter,
            'data': '',
            'chats': []
        };

        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    onKeyPressed(e) {
        const { cookies } = this.props;

        if(e.keyCode === 13) {
            let chats = this.state.chats;

            chats.push({
                id: cookies.get('id'),
                message: e.target.value,
                timestamp: "1"
            });

            this.setState({
               chats: chats
            });

            e.target.value = "";
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { cookies } = this.props;
        fetch("http://localhost:9000/chat/get/messages", {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-type'
            },
            body: JSON.stringify({
                "id": cookies.get('id'),
                "interlocuter": nextProps.interlocuter
            })
        }).then(response => {
            if(response.statusText === 'OK') {
                response.json().then(response => {
                    this.setState({
                        'chats': response.data
                    })
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        const { cookies } = this.props;

        if(this.props.data !== undefined) {
            return (
                <div className="chat-content">
                    <Header photo={JSON.parse(this.props.data).photo} name={JSON.parse(this.props.data).name}/>
                    <MessageList chats={this.state.chats} user_id={cookies.get('id')}/>
                    <MessageInput onKeyDown={this.onKeyPressed}/>
                </div>
            );
        } else {
            return (
              <div className="chat-content">
                  <h2 className="text-muted welcome-message">Open a chat!</h2>
              </div>
            );
        }
    }
}

class MessageInput extends Component {
    render() {
        return (
            <div className="message-bar">
                <input className="form-control message" placeholder="Enter message" onKeyDown={this.props.onKeyDown}/>
            </div>
        );
    }
}

export default withCookies(ChatWindow);