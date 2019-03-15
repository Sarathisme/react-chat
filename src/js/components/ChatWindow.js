import React, { Component } from 'react';
import '../../css/ChatWindow.css';
import { withCookies } from "react-cookie";
import ScrollToBottom from 'react-scroll-to-bottom';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:9000');

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
            <div className="message-li">
                  <div className="message-text" id={this.props.direction}>
                      {this.props.text}
                  </div>
            </div>
        );
    }
}

class MessageList extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.scrollToMyRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.scrollToMyRef();
    }

    getDirection(value) {
        if(value === this.props.user_id) {
            return "right";
        } else {
            return "left";
        }
    }

    render() {
        let messages;

        if(this.props.chats === undefined) {
            messages = <div className="message-ul"/>;
        } else {
            messages = <div className="message-ul">
                {this.props.chats.map(data => <Message direction={this.getDirection(data.id)} text={data.message} /> )}
            </div>;
        }
        return(
            <div className="messages">
                {messages}
                <div ref={this.props.myRef} />
            </div>
        );
    }
}

class ChatWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'interlocutor': this.props.interlocutor,
            'data': '',
            'chats': []
        };

        const { cookies } = this.props;
        this.subscribeToMessage(cookies.get('id'));
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    subscribeToMessage(id) {
        socket.on(id, data => {
            if(data.id === this.props.interlocutor) {
                const chats = this.state.chats;
                chats.push(data);

                this.setState({
                    chats: chats
                });
            }
        });
    }

    onKeyPressed(e) {
        const { cookies } = this.props;

        if(e.keyCode === 13) {
            let chats = this.state.chats;

            if(chats === undefined) chats = [];

            let message = {
                id: cookies.get('id'),
                message: e.target.value,
                timestamp: Date.now().toString()
            };

            socket.emit("chat", {"interlocutor": this.props.interlocutor, "message": message});
            chats.push(message);

            fetch("http://localhost:9000/chat/post/messages", {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-type'
                },
                body: JSON.stringify({
                    "id": cookies.get('id'),
                    "interlocutor": this.props.interlocutor,
                    "message": message
                })
            }).then(response => {
                if(response.statusText === 'OK') {
                    response.json().then(response => {
                        if(response.message === "success") {
                            this.setState({
                                chats: chats
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
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
                "interlocutor": nextProps.interlocutor
            })
        }).then(response => {
            if(response.statusText === 'OK') {
                response.json().then(response => {
                    this.setState({
                        'chats': response.data,
                    });
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
                    <MessageList chats={this.state.chats} user_id={cookies.get('id')} myRef={this.props.myRef} scrollToMyRef={this.props.scrollToMyRef}/>
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