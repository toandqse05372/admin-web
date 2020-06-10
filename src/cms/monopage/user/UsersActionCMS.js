import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, FormControl } from 'react-bootstrap'
import { actAddUserRequest, actUpdateUserRequest, actGetUserRequest, actFetchRolesRequest } from '../../../actions/indexUsers';
// import DateTimePicker from 'react-datetime-picker'
// import TimePicker from 'rc-time-picker';
// import ReactDOM from 'react-dom';
import 'rc-time-picker/assets/index.css';

class UsersActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtCity: '',
            txtOpenHours: '',
            txtPhoneNumber: '',
            txtDescription: '',
            txtPassword: '',
            txtRole: ''
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
            this.setState({
                id: itemEditing.id,
                txtFirstName: itemEditing.firstName,
                txtLastName: itemEditing.lastName,
                txtMail: itemEditing.mail,
                txtRole: itemEditing.roleKey,
                txtPhoneNumber: itemEditing.phoneNumber,
                txtPassword: itemEditing.password
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
        var { id, txtFirstName, txtLastName, txtMail, txtRole, txtPhoneNumber, txtPassword } = this.state;
        var user = {
            id: id,
            firstName: txtFirstName,
            lastName: txtLastName,
            password: txtPassword,
            mail: txtMail,
            roleKey: Array.isArray(txtRole) ? txtRole: [txtRole],
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

    render() {
        var { txtFirstName, txtLastName, txtMail, txtRole, txtPhoneNumber, txtPassword } = this.state;
        var { roles } = this.props
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Vui lòng nhập đầy đủ thông tin</legend>
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
                        <input onChange={this.onChange} value={txtPassword} name="txtPassword" type="text" className="form-control" />
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
                    <label>Role </label>
                    <Form.Control as="select"
                        name="txtRole"
                        value={txtRole}
                        onChange={this.onChange}>
                        <option key={0} index={0} value={0}>--Select Role--</option>
                        {this.showRoles(roles)}
                    </Form.Control>
                    <br />
                    <Link to="/users" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Trở Lại
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <i className="glyphicon glyphicon-save"></i> Lưu Lại
                            </button>
                </form>
            </div>
        );
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
