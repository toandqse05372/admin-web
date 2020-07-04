import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as URL from '../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';

class LoginCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            txtMail: '',
            txtPassword: '',
            txtError: ''
        }
        this.onSubmitForm = this.onSubmitForm.bind(this)
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,

        })
    }

    onSubmitForm(e) {
        e.preventDefault();
        const { txtMail, txtPassword, txtError } = this.state;
        var user = {
            mail: txtMail,
            password: txtPassword,
        };
        var self = this
        axios.post(URL.API_URL + '/login', user,
            {
                params: {
                    page: 'CMS'
                }
            }
        ).then(res => {
            localStorage.setItem('tokenLogin', JSON.stringify(res.data));
            window.location.reload();
        }).catch(function (error) {
            self.setState({
                txtError: "Wrong username or password"
            })
         });


    }


    render() {
        const { txtMail, txtPassword, txtError } = this.state;

        return (<div className="container-fluid-full">
            <div className="row-fluid">
                <div className="row-fluid">
                    <div className="login-box">
                    <div className="icons"></div>
                        <h2>Login to your account</h2>
                        <form className="form-horizontal" onSubmit={this.onSubmitForm}>
                            <fieldset>
                                <div className="input-prepend" title="Username">
                                    <span className="add-on"><i className="halflings-icon user" /></span>
                                    <input className="input-large span10"
                                        value={txtMail}
                                        name="txtMail"
                                        id="mail"
                                        type="text"
                                        onChange={this.onChange}
                                        placeholder="type mail" />
                                </div>
                                <div className="clearfix" />
                                <div className="input-prepend" title="Password">
                                    <span className="add-on"><i className="halflings-icon lock" /></span>
                                    <input className="input-large span10"
                                        value={txtPassword}
                                        name="txtPassword"
                                        id="mail"
                                        type="password"
                                        onChange={this.onChange}
                                        placeholder="type password" />
                                </div>
                                <div className="clearfix" />
                                <div className="button-login">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                    <h3 style={{color: 'red'}}>{txtError}</h3>
                                </div>
                                <div className="clearfix" />
                                <hr />
                                <h3>Forgot Password?</h3>
                                <p>
                                    No problem, <a href="#">click here</a> to get a new password.
                  </p>
                            </fieldset></form></div>{/*/span*/}
                </div>{/*/row*/}
            </div>{/*/.fluid-container*/}
        </div>
        );
    }

}


const mapDispatchToProps = (dispatch, props) => {
    return {
        // fetchAllUsers: (paramBody) => {
        //     dispatch(actFetchUsersRequest(paramBody));
        // },
        // fetchAllRoles: () => {
        //     dispatch(actFetchRolesRequest());
        // },
        // onDeleteUser: (id) => {
        //     dispatch(actDeleteUserRequest(id));
        // },
    }
}

export default connect(mapDispatchToProps)(LoginCMS);