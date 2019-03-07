import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from 'react-google-login';

class GoogleSignIn extends Component {

  constructor(props) {
    super(props);

    this.onSignIn = this.onSignIn.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onSignIn(response) {
    console.log(response.profileObj);
  }

  onFailure(response) {
    console.log(response);
  }

  render() {
    return (
        <div>
          <GoogleLogin
              clientId="195610010161-nnmg2nhcaoterfsdfqu7ubh1rd7jhl3s.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={this.onSignIn}
              onFailure={this.onFailure} />
        </div>
    )
  }
}

class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                </header>
              </div>
              <div className="col-lg-6 login">
                <div className="App-name">
                  <h1 className="display-4">Chat</h1>
                </div>
                <GoogleSignIn/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
