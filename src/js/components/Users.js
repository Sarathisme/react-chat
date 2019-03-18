import React, { Component } from 'react';
import '../../css/Users.css'
import { withCookies } from "react-cookie";
import openSocket from 'socket.io-client';

import List from '../components/List';
import SearchResults from '../components/SearchResults';
import {API_URL} from "../../config";

const socket = openSocket(API_URL);

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

    subscribeToMessage() {
        const { cookies } = this.props;
        socket.on(cookies.get('id'), data => {
            const chats = this.state.chats;
            const results = this.state.results;
            const show_search = this.state.show_search;

            let flag = false;

            // eslint-disable-next-line
            chats.map((chat, i) => {
                if(chat.user_id === data.id) {
                    flag = true;
                    chats[i].messages.push(data);
                    this.setState({
                        chats: chats,
                        results:results,
                        show_search: show_search
                    });
                }
            });

            if(!flag) {
                this.getRecentChats();
            }
        });
    }

    onSearchChange(e) {
        const { cookies } = this.props;

        if(e.target.value === '') {
            this.getRecentChats();
        }

        fetch(`${API_URL}get/users`, {
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

        fetch(`${API_URL}chat/get/users`, {
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
        this.subscribeToMessage();
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