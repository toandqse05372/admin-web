import React, { Component, container } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddUserRequest, actUpdateUserRequest, actGetUserRequest } from '../../../actions/indexUsers';
import DateTimePicker from 'react-datetime-picker'
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
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
            txtDescription: ''
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditUser(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtFirstName: itemEditing.firstName,
                txtLastName: itemEditing.lastName,
                txtMail: itemEditing.mail,
                txtRole: itemEditing.roleKey,
                txtPhoneNumber: itemEditing.phoneNumber
            })
        }
    }


    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        var { id, txtFirstName, txtLastName, txtMail, txtRole, txtPhoneNumber } = this.state;
        var user = {
            id: id,
            firstName: txtFirstName,
            lastName: txtLastName,
            mail: txtMail,
            roleKey: txtRole,
            phoneNumber: txtPhoneNumber
        };
        if (id) {
            this.props.onUpdateUser(user);
        } else {
            this.props.onAddUser(user);
        }
        this.props.history.goBack();
    }

    render() {
        var { txtFirstName, txtLastName, txtMail, txtRole, txtPhoneNumber } = this.state;
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
                        <label>Phone number </label>
                        <input onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="number" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Role </label>
                        <textarea onChange={this.onChange} value={txtRole} name="txtRole" className="form-control" rows="3">
                        </textarea>
                    </div>
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
        itemEditing: state.itemEditing
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddUser: (user) => {
            dispatch(actAddUserRequest(user));
        },
        onUpdateUser: (user) => {
            dispatch(actUpdateUserRequest(user));
        },
        onEditUser: (id) => {
            dispatch(actGetUserRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersActionCMS);
