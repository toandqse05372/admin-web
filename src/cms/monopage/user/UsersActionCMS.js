import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, FormControl } from 'react-bootstrap'
import { actAddUserRequest, actUpdateUserRequest, actGetUserRequest, actFetchRolesRequest } from '../../../actions/indexUsers';
import Select from 'react-select'
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
            fetched: false
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
                    fetched: true
                })
            }
        }else{
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
        var { id, txtFirstName, txtLastName, txtMail, drbRole, txtPhoneNumber, txtPassword } = this.state;
        var user = {
            id: id,
            firstName: txtFirstName,
            lastName: txtLastName,
            password: txtPassword,
            mail: txtMail,
            roleKey: Array.isArray(drbRole) ? drbRole : [drbRole],
            phoneNumber: txtPhoneNumber
        };
        if (id) {
            this.props.onUpdateUser(user);
        } else {
            this.props.onAddUser(user);
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
        for(let i = 0; i < selectedOption.length; i++){
            selectedKey.push(selectedOption[i].value)
        }
        this.setState({
            drbRole: selectedKey
        })
    }

    render() {
        var { txtFirstName, txtLastName, txtMail, drbRole, txtPhoneNumber, txtPassword, loaded } = this.state;
        var { roles } = this.props
        var options = []
        var renderOpt = []
        if (roles.length > 0 && this.state.fetched && typeof drbRole !== "undefined") {
            for (let i = 0; i < roles.length; i++) {
                var option = { value: roles[i].roleKey, label: roles[i].roleKey }
                options.push(option);
                if(drbRole.includes(option.label)){
                    renderOpt.push(option)
                }
            }
            debugger
            loaded = true;
        }  
        if (loaded) {
            return (
                <div className="container">
                    <form onSubmit={this.onSubmit}>
                        <legend>* Please enter full information</legend>
                        <div className="form-group">
                            <label>First Name </label>
                            <input onChange={this.onChange} value={txtFirstName} name="txtFirstName" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Last Name </label>
                            <input onChange={this.onChange} value={txtLastName} name="txtLastName" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Mail </label>
                            <input onChange={this.onChange} value={txtMail} name="txtMail" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Password </label>
                            <input onChange={this.onChange} value={txtPassword} name="txtPassword" type="password" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Phone number </label>
                            <input onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="number" className="form-control" />
                        </div>
                        {/* <div className="form-group">
                            <label>Role </label>
                            <textarea onChange={this.onChange} value={txtRole} name="txtRole" className="form-control" rows="3">
                            </textarea>
                        </div> */}
                        {/* <label>Role </label>
                        <Form.Control as="select"
                            name="txtRole"
                            value={txtRole}
                            onChange={this.onChange}>
                            <option key={0} index={0} value={0}>-- Choose Role --</option>
                            {this.showRoles(roles)}
                        </Form.Control> */}
                        <div className="myDiv">
                            <label>Role</label>
                            <div >
                                <Select
                                    defaultValue={renderOpt}
                                    isMulti
                                    options={options}
                                    onChange={this.onChangeRole}
                                />
                            </div>
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
        roles: state.roles
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
