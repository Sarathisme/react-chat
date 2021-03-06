import React, { Component } from 'react';
import '../../css/ChatWindow.css';
import { withCookies } from "react-cookie";

import Header from '../components/ChatWindowHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

import {API_URL} from "../../config";

import io from 'socket.io-client';
const socket = io(API_URL);

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

        if(e.target.value !== '') {
            socket.emit("typing", {"id": this.props.interlocutor, "typing": true, "interlocutor": cookies.get('id')});
        } else {
            socket.emit("typing", {"id": this.props.interlocutor, "typing": false, "interlocutor": cookies.get('id') });
        }

        if(e.keyCode === 13) {
            let chats = this.state.chats;

            if(chats === undefined) chats = [];

            let message = {
                sender_id: cookies.get('id'),
                receiver_id: this.props.interlocutor,
                message: e.target.value,
                timestamp: Date.now().toString(),
                _id: Date.now().toString()
            };

            socket.emit("chat", {"interlocutor": this.props.interlocutor, "message": message});
            chats.push(message);

            fetch(`${API_URL}chat/post/messages`, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-type'
                },
                body: JSON.stringify({
                    "sender_id": message.sender_id,
                    "receiver_id": message.receiver_id,
                    "message": message.message,
                    "timestamp": message.timestamp
                })
            }).then(response => {
                if(response.statusText === 'OK') {
                    response.json().then(response => {
                        if(response.message === "success") {
                            this.setState({
                                chats: chats
                            });
                            socket.emit("chat", {"interlocuter": this.props.interlocuter, "message": message});
                            socket.emit("typing", {"id": this.props.interlocutor, "typing": false, "interlocutor": cookies.get('id') });
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

        fetch(`${API_URL}chat/get/messages`, {
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
                    <MessageList chats={this.state.chats} interlocutor={this.props.interlocutor} user_id={cookies.get('id')} myRef={this.props.myRef} scrollToMyRef={this.props.scrollToMyRef}/>
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

export default withCookies(ChatWindow);