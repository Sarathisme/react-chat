import React, { Component } from 'react';
import '../../css/Navbar.css';
import { withCookies } from "react-cookie";

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: "https://placeimg.com/640/480/any",
            name: "John Doe"
        };
    }

    componentDidMount() {
        const { cookies } = this.props;

        fetch('http://localhost:9000/user', {
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
                        name: data['name']
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
        return (
            <div>
                <nav className="navbar navbar-light bg-light sticky-top">
                    <a className="navbar-brand" href="#">
                        <img className="logo" src={this.state.photo} width="40" height="40" alt="Profile image"/>
                    </a>
                    <p className="display_name">{this.state.name}</p>
                    <button className="btn btn-outline-danger btn-sm ml-auto">Logout</button>
                </nav>
            </div>
        );
    }
}

export default withCookies(Navbar);