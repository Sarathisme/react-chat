import {Component} from "react";
import React from "react";

class MessageInput extends Component {
    render() {
        return (
            <div className="message-bar">
                <input className="form-control message" placeholder="Enter message" onKeyDown={this.props.onKeyDown}/>
            </div>
        );
    }
}

export default MessageInput;