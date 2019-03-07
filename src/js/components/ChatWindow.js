import React, { Component } from 'react';
import '../../css/ChatWindow.css';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="chat-content">
                <h1>Hello, world</h1>
            </div>
        );
    }
}

export default ChatWindow;