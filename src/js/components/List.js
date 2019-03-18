import {Component} from "react";
import React from "react";
import '../../css/Users.css';

class List extends Component {
    render() {
        return (
            <ul className="list-group">
                { this.props.chats.map((chat, i) =>
                    <li key={ chat.user_id } id={ chat.user_id } className="list-group-item d-flex justify-content-between align-items-center" onClick={this.props.onItemClick}>
                        { chat.name }
                        <span className="badge badge-primary badge-pill">{ chat.messages.length }</span>
                    </li>
                )}
            </ul>
        );
    }
}

export default List;