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
                txtName: itemEditing.name,
                txtDescription: itemEditing.description,
                txtPhoneNumber: itemEditing.phoneNumber,
                txtOpenHours: itemEditing.openHours,
                txtCity: itemEditing.cityId
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
        var { id, txtName, txtDescription, txtCity, txtOpenHours, txtPhoneNumber } = this.state;
        var user = {
            id: id,
            name: txtName,
            cityName: txtCity,
            shortDescription: txtDescription,
            openHours: txtOpenHours,
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
        var { txtName, txtDescription, txtCity, txtOpenHours, txtPhoneNumber } = this.state;
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <legend>* Vui lòng nhập đầy đủ thông tin</legend>
                    <div className="form-group">
                        <label>user name </label>
                        <input onChange={this.onChange} value={txtName} name="txtName" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>City </label>
                        <input onChange={this.onChange} value={txtCity} name="txtCity" type="text" className="form-control" />

                    </div>
                    <div className="form-group">
                        <label>Open hours </label>
                        <TimePicker/>
                    </div>
                    <div className="form-group">
                        <label>Phone number </label>
                        <input onChange={this.onChange} value={txtPhoneNumber} name="txtPhoneNumber" type="number" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Description </label>
                        <textarea onChange={this.onChange} value={txtDescription} name="txtDescription" className="form-control" rows="3">
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
