import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, InputGroup } from 'react-bootstrap'
import { connect } from 'react-redux';
import UserItem from './components/UserItem';
import UserList from './components/UserList';
import { actFetchUsersRequest, actDeleteUserRequest } from '../../../actions/indexUsers';

class UsersCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtUserName: '',
            paramBody: {
                name: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {
        // Gọi trước khi component đc render lần đầu tiên
        console.log()
        debugger
        this.props.fetchAllUsers(this.state.paramBody);
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                name: value,
                page: 1,
                limit: 10,
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.props.fetchAllUsers(this.state.paramBody);
    }

    render() {
        const { txtUserName } = this.state;
        var { users } = this.props;
        return (
            <div className="container span14">
                <Form onSubmit={this.onSubmitSearch} >
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Search"
                            name="txtUserName"
                            value={txtUserName}
                            onChange={this.onChange}
                        />
                    </InputGroup>
                    <Button
                        type="Submit"
                        variant="outline-success">
                        Search
                    </Button>
                </Form>
                <Link to="/users/add" className="btn btn-primary mb-5 ">
                    <i className="glyphicon glyphicon-plus"></i> Add User
                </Link>
                <UserList>
                    {this.showUser(users)}
                </UserList>
            </div>
        );
    }

    showUser(users) {
        var result = null;
        var { onDeleteUser } = this.props;
        if (users.length > 0) {
            result = users.map((users, index) => {
                return <UserItem users={users} key={index} index={index} onDeleteUser={onDeleteUser} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    console.log(this)
    debugger
    return {
        users: state.users
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllUsers: (paramBody) => {
            dispatch(actFetchUsersRequest(paramBody));
        },
        onDeleteUser: (id) => {
            dispatch(actDeleteUserRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCMS);