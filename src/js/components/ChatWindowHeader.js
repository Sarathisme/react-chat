import {Component} from "react";
import React from "react";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'photo': this.props.photo,
            'name': this.props.name
        }
    }

    render() {
        return (
            <div className="profile">
                <div className="navbar-brand">
                    <img className="profile-image" src={this.props.photo} width="40" height="40" alt="Profile"/>
                </div>
                <p className="profile-name">{this.props.name}</p>
            </div>
        );
    }
}

export default Header;