import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Users from './components/Users';
import ChatWindow from './components/ChatWindow';
import '../css/Dashboard.css';
import { withCookies } from "react-cookie";

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="body">
                <Navbar />
                <div className="container-fluid content">
                    <div className="row">
                        <div className="col-lg-3">
                            <Users/>
                        </div>
                        <div className="col-lg-9">
                            <ChatWindow/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Dashboard);