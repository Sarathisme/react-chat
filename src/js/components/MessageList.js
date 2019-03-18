import {Component} from "react";
import Message from '../components/Message';
import React from "react";

import io from 'socket.io-client';
const socket = io("http://localhost:9000");

class MessageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            'typing': false
        };

        this.subscribeToTyping = this.subscribeToTyping.bind(this);
    }

    subscribeToTyping() {
        socket.on('typing', (data) => {
            if(data.id === this.props.user_id && data.typing === true) {
                this.setState({
                    'typing': true
                });
            }
        });
    }

    getDirection(value) {
        if(value === this.props.user_id) {
            return "right";
        } else {
            return "left";
        }
    }

    render() {
        let messages, status;

        if(this.state.typing) {
            status = <div className="typing">Typing......</div>;
        } else {
            status = <div/>;
        }

        if (this.props.chats === undefined) {
            messages = <div className="message-ul"/>;
        } else {
            messages = <div className="message-ul">
                {this.props.chats.map(data => <Message direction={this.getDirection(data.id)} text={data.message}
                                                       scrollToMyRef={this.props.scrollToMyRef}
                                                       myRef={this.props.myRef}/>)}
                {status}
            </div>;
        }

        return(
            <div className="messages">
                {messages}
            </div>
        );
    }
}

export default MessageList;