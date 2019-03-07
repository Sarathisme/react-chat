import React, { Component } from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import { GoogleLogin } from 'react-google-login';
import {Redirect} from "react-router-dom";

class GoogleSignIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      data: null
    }
  }

  render() {
    return (
        <div>
          <GoogleLogin
              clientId="195610010161-nnmg2nhcaoterfsdfqu7ubh1rd7jhl3s.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={this.props.onSuccess}
              onFailure={this.props.onFailure}/>
        </div>
    )
  }
}

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
    this.setState({
      redirect: true,
      data: response.profileObj
    })
  }

  onFailure(response) {
    console.log(response);
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

export default App;
