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
            data: this.props.location.data
        };

        const cookies = this.props.cookies;
        console.log(cookies.get("id"));
    }

    render() {
        return (
            <div className="body">
                {/*<Navbar data={*/}
                    {/*{*/}
                        {/*photo: this.state.data.imageUrl,*/}
                        {/*name: this.state.data.name*/}
                    {/*}*/}
                {/*} />*/}
                <div className="container-fluid content">
                    <div className="row">
                        <div className="col-lg-3">
                            {/*<Users/>*/}
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