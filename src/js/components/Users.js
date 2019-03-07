import React, { Component } from 'react';
import '../../css/Users.css';

class Users extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="users-content">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" className="form-control" placeholder="Search"/>
                    <div>
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Sarath Sattiraju
                                <span className="badge badge-primary badge-pill">14</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Kevin Alex
                                <span className="badge badge-primary badge-pill">2</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Avinash Vijay Kumar
                                <span className="badge badge-primary badge-pill">1</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;