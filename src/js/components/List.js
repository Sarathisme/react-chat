import {Component} from "react";
import React from "react";
import '../../css/Users.css';

class List extends Component {
    render() {
        return (
            <ul className="list-group">
                { this.props.chats.map((chat, i) =>
                    <li key={ chat._id } id={ chat.id } className="list-group-item d-flex justify-content-between align-items-center" onClick={this.props.onItemClick}>
                        { chat.name }
                    </li>
                )}
            </ul>
        );
    }
}

export default List;