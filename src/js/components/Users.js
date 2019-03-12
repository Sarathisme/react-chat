import React, { Component } from 'react';
import '../../css/Users.css';
import { withCookies } from "react-cookie";

class List extends Component {
    constructor(props) {
        super(props);
    }

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

class SearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "users": this.props.results
        }
    }

    render() {
        return (
            <ul className="list-group">
                {
                    Object.values(JSON.parse(this.state.users)).map((user) =>
                        <li key={ user.id } id={ user.id } className="list-group-item d-flex justify-content-between align-items-center" onClick={this.props.onItemClick}>
                            { user.name }
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
            results: [],
            show_search: false,
        };

        this.onSearchChange = this.onSearchChange.bind(this);
        this.getRecentChats = this.getRecentChats.bind(this);
    }

    onSearchChange(e) {
        const { cookies } = this.props;

        if(e.target.value === '') {
            this.getRecentChats();
        }

        fetch("http://localhost:9000/get/users", {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-type'
            },
            body: JSON.stringify({
                "id": cookies.get('id'),
                "query": e.target.value
            }),
        }).then(response => {
            if (response.statusText === 'OK') {
                response.json().then(data => {
                    this.setState({
                        show_search: true,
                        results: data.results
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    getRecentChats() {
        const { cookies } = this.props;

        fetch("http://localhost:9000/chat/get/users", {
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
                        'show_search': false
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getRecentChats();
    }

    render() {
        let list;

        if (!this.state.show_search) {
            list = <List chats={this.state.chats} onItemClick={this.props.onItemClick}/>
        } else {
            list = <SearchResults results={JSON.stringify(this.state.results)} onItemClick={this.props.onItemClick}/>
        }

        return (
            <div className="users-content">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"/>
                    <input type="text" className="form-control input" placeholder="Search" onChange={this.onSearchChange}/>
                    <div>
                        {list}
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Users);