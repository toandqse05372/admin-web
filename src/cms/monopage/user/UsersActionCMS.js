import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, FormControl } from 'react-bootstrap'
import { actAddUserRequest, actUpdateUserRequest, actGetUserRequest, actFetchRolesRequest } from '../../../actions/indexUsers';
import Select from 'react-select';
import validateInput from '../../../utils/regex';
import 'rc-time-picker/assets/index.css';

class UsersActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            id: '',
            txtName: '',
            txtCity: '',
            txtOpenHours: '',
            txtPhoneNumber: '',
            txtDescription: '',
            txtPassword: '',
            drbRole: [],
            fetched: false,
            currentPassword: '',

            errorRole: '',
            errorPassword: '',
            errorPhoneNUmber: '',
            errorEmail: ''
        };
    }

    componentDidMount() {
        this.props.fetchAllRoles();
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditUser(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            if (typeof itemEditing.id !== "undefined") {
                this.setState({
                    id: itemEditing.id,
                    txtFirstName: itemEditing.firstName,
                    txtLastName: itemEditing.lastName,
                    txtMail: itemEditing.mail,
                    drbRole: itemEditing.roleKey,
                    txtPhoneNumber: itemEditing.phoneNumber,
                    txtPassword: itemEditing.password,
                    currentPassword: itemEditing.password,
                    fetched: true
                })
            }
        } else {
            this.setState({
                fetched: true
            })
        }
    }


    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtFirstName, txtLastName, txtMail, drbRole, txtPhoneNumber, txtPassword, currentPassword } = this.state;
        var user = {
            id: id,
            firstName: txtFirstName,
            lastName: txtLastName,
            password: txtPassword,
            mail: txtMail,
            roleKey: drbRole,
            phoneNumber: txtPhoneNumber
        };
        var hasError = false
        var errorPasswordStr = ''
        if (txtPassword.localeCompare(currentPassword)) {
            const checkPassword = validateInput("password", txtPassword);
            if (!checkPassword.isInputValid) {
                hasError = true
                errorPasswordStr = checkPassword.errorMessage
            }
        }
        const checkPhoneNumber = validateInput("phoneNumber", txtPhoneNumber);
        var errorPhoneNUmberStr = ''
        if (!checkPhoneNumber.isInputValid) {
            hasError = true
            errorPhoneNUmberStr = checkPhoneNumber.errorMessage
        }
        const checkEmail = validateInput("email", txtMail);
        var errorMailStr = ''
        if (!checkEmail.isInputValid) {
            hasError = true
            errorMailStr = checkEmail.errorMessage
        }
        var errorRoleStr = ''
        if (drbRole.length < 1) {
            hasError = true
            errorRoleStr = 'Please choose at least one role'
        }

        if (!hasError) {
            if (id) {
                this.props.onUpdateUser(user);
            } else {
                this.props.onAddUser(user);
            }
        }else{
            this.setState({
                errorPassword: errorPasswordStr,
                errorPhoneNUmber: errorPhoneNUmberStr,
                errorEmail: errorMailStr,
                errorRole: errorRoleStr
            })
        }

    }

    showRoles(roles) {
        var result = null;
        if (roles.length > 0) {
            result = roles.map((roles, index) => {
                return <option key={index} index={index} value={roles.roleKey}>{roles.roleKey}</option>
            });
        }
        return result;
    }

    onChangeRole = (selectedOption) => {
        var selectedKey = []
        if (selectedOption !== null) {
            for (let i = 0; i < selectedOption.length; i++) {
                selectedKey.push(selectedOption[i].value)
            }
        }
        this.setState({
            drbRole: selectedKey
        })
    }

    render() {
        var { txtFirstName, txtLastName, txtMail, drbRole, txtPhoneNumber, txtPassword, loaded, errorRole, errorPassword,
            errorPhoneNUmber, errorEmail } = this.state;
        var { roles } = this.props
        var options = []
        var renderOpt = []
        if (roles.length > 0 && this.state.fetched && typeof drbRole !== "undefined") {
            for (let i = 0; i < roles.length; i++) {
                var option = { value: roles[i].roleKey, label: roles[i].roleKey }
                options.push(option);
                if (drbRole.includes(option.label)) {
                    renderOpt.push(option)
                }
            }
            loaded = true;
        }
        if (loaded) {
            return (
                <div className="container">
                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="form-group">
                            <label>First Name *</label>
                            <input required style={{ width: 350 }} onChange={this.onChange} value={txtFirstName} name="txtFirstName" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input required style={{ width: 350 }} onChange={this.onChange} value={txtLastName} name="txtLastName" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <div className="rowElement">
                                <label>Mail *</label>
                                <input required style={{ width: 350 }} onChange={this.onChange} value={txtMail} name="txtMail" type="text" className="form-control" />
                            </div>
                            <span className="rowElement"><h4 style={{ color: 'red' }}>{errorEmail}</h4></span>
                        </div>
                        <div className="form-group">
                            <div className="rowElement">
                                <label>Password *</label>
                                <input required style={{ width: 350 }} onChange={this.onChange} value={txtPassword} name="txtPassword" type="password" className="form-control " />
                            </div>
                            <span className="rowElement"><h4 style={{ color: 'red' }}>{errorPassword}</h4></span>
                        </div>

                        <div className="form-group">
                            <div className="rowElement">
                                <label>Phone number *</label>
                                <input required style={{ width: 350 }} onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="text" className="form-control rowElement" />
                            </div>
                            <span className="rowElement"><h4 style={{ color: 'red' }}>{errorPhoneNUmber}</h4></span>
                        </div>

                        <div className="myDiv">
                            <label>Role *</label>
                            <div className="rowElement">
                                <Select
                                    defaultValue={renderOpt}
                                    isMulti
                                    options={options}
                                    onChange={this.onChangeRole}
                                />
                            </div>
                            <span className="rowElement"><h3 style={{ color: 'red' }}>{errorRole}</h3></span>
                        </div>
                        <br />
                        <Link to="/users" className="btn btn-danger mr-5">
                            <i className="glyphicon glyphicon-arrow-left"></i> Back
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            <i className="glyphicon glyphicon-save"></i> Save User
                                </button>
                    </form>
                </div>
            );
        } else
            return ""
    }
}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing,
        roles: state.roles,
        overlay: state.overlay
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddUser: (user) => {
            dispatch(actAddUserRequest(user, props.history));
        },
        onUpdateUser: (user) => {
            dispatch(actUpdateUserRequest(user, props.history));
        },
        onEditUser: (id) => {
            dispatch(actGetUserRequest(id));
        },
        fetchAllRoles: () => {
            dispatch(actFetchRolesRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersActionCMS);
