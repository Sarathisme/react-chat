import React, { Component } from 'react';
import '../../css/Navbar.css';
import { withCookies } from "react-cookie";

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: "",
            name: ""
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
                <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img className="logo" src={this.state.photo} width="50" height="50" alt=""/>
                    </a>
                    <h5 className="display_name">{this.state.name}</h5>
                    <button className="btn btn-outline-danger btn-sm ml-auto">Logout</button>
                </nav>
            </div>
        );
    }
}

export default withCookies(Navbar);