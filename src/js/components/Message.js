import {Component} from "react";
import React from "react";

class Message extends Component {

    componentDidMount() {
        this.props.scrollToMyRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props
            .scrollToMyRef();
    }

    render() {
        return (
            <div className="message-li">
                <div className="message-text" id={this.props.direction} key={this.props.id}>
                    {this.props.text}
                    <div ref={this.props.myRef} />
                </div>
            </div>
        );
    }
}

export default Message;