import {Component} from "react";
import Message from '../components/Message';
import React from "react";
import {API_URL} from "../../config";

import io from 'socket.io-client';
const socket = io(API_URL);

class MessageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            'typing': false
        };

        this.subscribeToTyping();
    }

    subscribeToTyping() {
        socket.on('typing', (data) => {
            if(data.id === this.props.user_id && data.typing === true && data.interlocutor === this.props.interlocutor) {
                this.setState({
                    'typing': true
                });
            } else {
                this.setState({
                    'typing': false
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
                {this.props.chats.map(data => <Message direction={this.getDirection(data.receiver_id)} text={data.message}
                                                       scrollToMyRef={this.props.scrollToMyRef}
                                                       id={data._id}
                                                       key={data._id}
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