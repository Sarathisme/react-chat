import React, { Component } from 'react';
import '../../css/Navbar.css';
import { withCookies } from "react-cookie";
import { GoogleLogout } from 'react-google-login';
import {Redirect} from "react-router-dom";

import {API_URL} from "../../config";

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: "https://placeimg.com/640/480/any",
            name: "John Doe",
            logout: false,
            load: true
        };

        this.logout = this.logout.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
    }

    logout() {
        this.setState({
            photo: this.state.photo,
            name: this.state.name,
            logout: true
        })
    }

    loadProfile() {

        const { cookies } = this.props;

        fetch(`${API_URL}user`, {
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
            if(response.statusText === "OK") {
                response.json().then((data) => {
                    this.setState({
                        photo: data['photo'],
                        name: data['name'],
                        load: false
                    });
                });
            } else {
                console.log(response);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const { cookies } = this.props;

        if(this.state.load) {
            this.loadProfile();
        }

        if(this.state.logout) {
            cookies.remove('id');
            return (
                <Redirect to={
                    {
                        pathname: "/",
                        data: this.state.data,
                    }
                }/>
            )
        }else {
            return (
                <div>
                    <nav className="navbar navbar-light bg-light sticky-top">
                        <div className="navbar-brand">
                            <img className="logo" src={this.state.photo} width="40" height="40" alt="Profile"/>
                        </div>
                        <p className="display_name mr-auto">{this.state.name}</p>
                        <GoogleLogout
                            buttonText="Logout"
                            onLogoutSuccess={this.logout}>
                        </GoogleLogout>
                    </nav>
                </div>
            );
        }
    }
}

export default withCookies(Navbar);