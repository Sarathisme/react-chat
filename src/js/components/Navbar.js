import React, { Component } from 'react';
import '../../css/Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: this.props.data.photo,
            name: this.props.data.name
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img className="logo" src={this.state.url} width="65" height="65" alt=""/>
                    </a>
                    <button className="btn btn-outline-danger btn-sm ml-auto">Logout</button>
                </nav>
            </div>
        );
    }
}

export default Navbar;