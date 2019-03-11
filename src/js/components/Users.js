import React, { Component } from 'react';
import '../../css/Users.css';
import { withCookies } from "react-cookie";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "data": this.props.chats
        };
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
                        <li key={ user.id } className="list-group-item d-flex justify-content-between align-items-center" onClick={this.props.onItemClick}>
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

        this.onItemClick = this.onItemClick.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.getRecentChats = this.getRecentChats.bind(this);
    }

    onItemClick(e) {
        alert("Item clicked!");
    }

    onSearchChange(e) {

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
        this.setState({
            chats: [],
            show_search: false,
            results: []
        });

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

    componentWillMount() {
        this.getRecentChats();
    }

    render() {
        let list;

        if (!this.state.show_search) {
            list = <List chats={this.state.chats} onItemClick={this.onItemClick}/>
        } else {
            list = <SearchResults results={JSON.stringify(this.state.results)} onItemClick={this.onItemClick}/>
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