import React, { Component } from 'react';
import '../../css/Users.css';
import { withCookies } from "react-cookie";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "data": this.props.chats
        };

        console.log("Here");
    }

    render() {
        return (
            <ul className="list-group">
                { this.state.data.map((chat, i) =>
                    <li key={ chat.user_id } className="list-group-item d-flex justify-content-between align-items-center" onClick={this.props.onItemClick}>
                        { chat.name }
                        <span className="badge badge-primary badge-pill">{ chat.messages.length }</span>
                    </li>
                )}
            </ul>
        );
    }
}

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [],
            count: 0
        };

        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick(e) {
        alert("Item clicked!");
    }

    componentWillMount() {
        const { cookies } = this.props;
        const id = cookies.get('id');

        fetch("http://localhost:9000/chat/users", {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-type'
            },
            body: JSON.stringify({
                "id": cookies.get('id'),
            })
        }).then(response => {
            if(response.statusText === 'OK') {
                response.json().then(data => {
                    this.setState({
                        'chats': data.chats,
                        'count': data.chats.length
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        let list;

        if ( this.state.count > 0) {
            list = <List chats={this.state.chats} onItemClick={this.onItemClick}/>
        }

        return (
            <div className="users-content">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"/>
                    <input type="text" className="form-control" placeholder="Search"/>
                    <div>
                        {list}
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Users);