import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as URL from '../../constants/ConfigURL';
import validateInput from '../../utils/regex';

class LoginCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            txtMail: '',
            txtPassword: '',
            txtError: '',
            disableLogin: false
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
        const checkEmail = validateInput("email", txtMail);
        if (!checkEmail.isInputValid) {
            this.setState({ txtError: checkEmail.errorMessage })
        } else {
            var user = {
                mail: txtMail,
                password: txtPassword,
            };
            var self = this
            this.setState({ disableLogin: true })
            axios.post(URL.API_URL + '/login', user,
                {
                    params: {
                        page: 'CMS'
                    }
                }
            ).then(res => {
                self.setState({ disableLogin: false })
                localStorage.setItem('tokenLogin', JSON.stringify(res.data));
                window.location.reload();
            }).catch(error => {
                var errorStr = '';
                if (error.response) {
                    if (error.response.data === 'WRONG_USERNAME_PASSWORD') {
                        errorStr = "Wrong username or password"
                    } else {
                        errorStr = "Account doesn't have access to CMS"
                    }
                }
                self.setState({
                    txtError: errorStr,
                    disableLogin: false
                })
            });
        }

    }


    render() {
        const { txtMail, txtPassword, txtError, txtStatus, showOverlay, disableLogin } = this.state;
        return (
            <div className="container-fluid-full">
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
                                            placeholder="Email" />
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
                                            placeholder="Password" />
                                    </div>
                                    <div className="clearfix" />
                                    <div className="button-login">
                                        <button disabled={disableLogin} type="submit" className="btn btn-primary rowElement">
                                            {!disableLogin ? 'Login': 'Please wait'}
                                        </button>
                                        <h3 style={{ color: 'red' }}>{txtError}</h3>
                                    </div>
                                    <div className="clearfix" />
                                   
                                </fieldset></form></div>{/*/span*/}
                    </div>{/*/row*/}
                </div>{/*/.fluid-container*/}
            </div>
        );
    }

}

export default LoginCMS;