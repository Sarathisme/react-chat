import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Users from './components/Users';
import ChatWindow from './components/ChatWindow';
import '../css/Dashboard.css';
import { withCookies } from "react-cookie";

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'interlocutor': ''
        };

        this.onItemClick = this.onItemClick.bind(this);
        this.getConversation = this.getConversation.bind(this);
    }

    onItemClick(event) {
        const id = event.target.id;
        this.getConversation(id);
    }

    getConversation(id) {
        const { cookies } = this.props;

        fetch("http://localhost:9000/chat/get/user", {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-type'
            },
            body: JSON.stringify({
                "id": cookies.get('id'),
                "interlocutor": id
            })
        }).then(response => {
            if(response.statusText === 'OK') {
                response.json().then(data => {
                    this.setState({
                        'interlocutor': id,
                        'data': JSON.stringify(data.user),
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="body">
                <Navbar />
                <div className="container-fluid content">
                    <div className="row">
                        <div className="col-lg-3">
                            <Users onItemClick={this.onItemClick}/>
                        </div>
                        <div className="col-lg-9">
                            <ChatWindow data={this.state.data} interlocutor={this.state.interlocutor} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Dashboard);