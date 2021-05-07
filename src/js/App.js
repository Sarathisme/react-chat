import React, { Component } from 'react';

import logo from '../logo.svg';
import '../css/App.css';

import GoogleSignIn from './components/GoogleSignIn';

import {Redirect} from "react-router-dom";
import { withCookies } from 'react-cookie';

import { API_URL } from '../config';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      data: null
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onSuccess(response) {
    const id = response.profileObj.googleId;
    fetch(`${API_URL}add/user`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id: response.profileObj.googleId,
        name: response.profileObj.name,
        email: response.profileObj.email,
        photo: response.profileObj.imageUrl,
      })
    }).then((response) => {
        if(response.statusText === "OK") {
          const { cookies } = this.props;
          cookies.set("id", id, {path: '/'});

          this.setState({
            redirect: true,
          });
        } else {
          console.log("From App.js", response);
        }
    }).catch((error) => {
      console.log("From App.js error", error);
    });
  }

  onFailure(response) {
    console.log(("From App.js failure", response));
  }

  render() {
    if(this.state.redirect) {
      return (
          <Redirect to={
            {
              pathname: "/dashboard",
              data: this.state.data,
            }
          } />
      );
    } else {
      return (
          <div className="App">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                  </header>
                </div>
                <div className="col-lg-6 login">
                  <div className="App-name">
                    <h1 className="display-4">Chat</h1>
                  </div>
                  <GoogleSignIn onSuccess={this.onSuccess} onFailure={this.onFailure}/>
                </div>
              </div>
            </div>
          </div>
      );
    }
  }
}

export default withCookies(App);
