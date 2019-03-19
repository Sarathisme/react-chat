import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Users from './components/Users';
import ChatWindow from './components/ChatWindow';
import '../css/Dashboard.css';
import { withCookies } from "react-cookie";

import {API_URL} from "../config";

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'interlocutor': ''
        };

        this.myRef = React.createRef();   // Create a ref object
        this.onItemClick = this.onItemClick.bind(this);
    }

    scrollToMyRef = () => {
        if(this.myRef.current !== null) return this.myRef.current.scrollIntoView({behavior: "smooth", block: "end"});
    };

    onItemClick(event) {
        const interlocutor_id = event.target.id;

        fetch(`${API_URL}chat/get/user`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-type'
            },
            body: JSON.stringify({
                "interlocutor": event.target.id
            })
        }).then(response => {
            if(response.statusText === 'OK') {
                response.json().then(data => {
                    this.setState({
                        'interlocutor': interlocutor_id,
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
                            <ChatWindow myRef={this.myRef} data={this.state.data} interlocutor={this.state.interlocutor} scrollToMyRef={this.scrollToMyRef} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Dashboard);