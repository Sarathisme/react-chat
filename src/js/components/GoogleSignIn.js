import {Component} from "react";
import React from "react";
import { GoogleLogin } from 'react-google-login';
import { CLIENT_ID } from '../../config';

class GoogleSignIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
        }
    }

    render() {
        return (
            <div>
                <GoogleLogin
                    clientId={CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={this.props.onSuccess}
                    onFailure={this.props.onFailure}/>
            </div>
        )
    }
}

export default GoogleSignIn;