import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import axios from 'axios';
import * as Config from '../../../constants/ConfigURL';
import * as LoadType from '../../../constants/LoadingType';
import UserItem from './components/UserItem';
import UserList from './components/UserList';
import { actFetchUsersRequest, actDeleteUserRequest, actFetchRolesRequest } from '../../../actions/indexUsers';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from '../../../actions/indexOverlay';

class UsersCMS extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            loaded: false,
            activePage: 1,
            currentPage: 1,
            searchList: [],
            totalItems: 0,
            totalPage: 1,

            txtFirstName: '',
            txtLastName: '',
            txtMail: '',
            txtPhoneNumber: '',
            drbRole: 0,
            drbLimit: 10,

            paramBody: {
                firstName: '',
                lastName: '',
                mail: '',
                phoneNumber: '',
                role: 0,
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {
        // Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.state.paramBody);
        this.props.fetchAllRoles();
        this.setState({
            activePage: 1
        })
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        console.log(this.state)
        this.setState({
            [name]: value,
            paramBody: {
                firstName: (name === 'txtFirstName') ? value : this.state.txtFirstName,
                lastName: (name === "txtLastName") ? value : this.state.txtLastName,
                mail: (name === "txtMail") ? value : this.state.txtMail,
                phoneNumber: (name === "txtPhoneNumber") ? value : this.state.txtPhoneNumber,
                role: (name === "drbRole") ? value : this.state.drbRole,
                page: this.state.activePage,
                limit: (name === "drbLimit") ? value : this.state.drbLimit,
            }
        })
    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.setState({
            currentPage: 1
        })
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        this.props.showOverlay(LoadType.loading)
        var props = this.props
        axios.get(Config.API_URL + '/user/searchMul',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    firstName: paramBody.firstName,
                    lastName: paramBody.lastName,
                    mail: paramBody.mail,
                    phoneNumber: paramBody.phoneNumber,
                    role: paramBody.role,
                    limit: paramBody.limit,
                    page: paramBody.page
                }
            }
        ).then(res => {
            //set state
            this.props.showOverlay(LoadType.none)
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems
            })
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            props.history.push("/error");
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            if (localStorage.getItem('deleteResult')) {
                const excelResult = localStorage.getItem('deleteResult');
                if(excelResult === "OK"){
                    NotificationManager.success('Success message', 'Deltete city successful');
                    localStorage.removeItem('deleteResult');
                }else{
                    NotificationManager.error('Error message', "Something wrong");
                    localStorage.removeItem('deleteResult');
                }
            }
            const pageList = []
            const { txtFirstName, txtLastName, txtPhoneNumber, txtMail, drbRole, drbLimit, currentPage, totalItems } = this.state;
            var { users } = this.props;
            var { roles } = this.props
            for (let i = 1; i <= this.state.totalPage; i++) {
                pageList.push(i)
            }
            const renderPageNumbers = pageList.map(number => {
                if (number == currentPage) {
                    return (
                        <li className="active" disabled >
                            <a value={number} >{number}</a>
                        </li>
                    );
                } else
                    return (
                        <li className='pointer'>
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
                        </li>
                    );
            });
            return (
                <div >
                    <Form onSubmit={this.onSubmitSearch} >
                        <h1>User Manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">First Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            maxLength={255}
                                            placeholder="First Name"
                                            name="txtFirstName"
                                            value={txtFirstName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th><Form.Label id="basic-addon1">Last Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            maxLength={255}
                                            placeholder="Last Name"
                                            name="txtLastName"
                                            value={txtLastName}
                                            onChange={this.onChange}
                                        /></th>
                                    <th><Form.Label id="basic-addon1">Mail </Form.Label>
                                        <FormControl
                                            type="text"
                                            maxLength={255}
                                            placeholder="Mail"
                                            name="txtMail"
                                            value={txtMail}
                                            onChange={this.onChange}
                                        /></th>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label id="basic-addon1">Phone number </Form.Label>
                                        <FormControl
                                            type="text"
                                            maxLength={255}
                                            placeholder="Phone number"
                                            name="txtPhoneNumber"
                                            value={txtPhoneNumber}
                                            onChange={this.onChange}
                                        />
                                    </td>
                                    <td>
                                        <Form.Label id="basic-addon1">Role </Form.Label>
                                        <Form.Control as="select"
                                            name="drbRole"
                                            value={drbRole}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>-- Choose Role --</option>
                                            {this.showRoles(roles)}
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Label>Show</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / page</option>
                                            <option key={1} index={1} value={15}>15 / page</option>
                                            <option key={2} index={2} value={20}>20 / page</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Search
                                        </Button>
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/users/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add New User
                    </Link>
                    <UserList totalItems={totalItems}>
                        {this.showUser(this.state.searchList)}
                    </UserList>
                    <div className="dataTables_paginate paging_bootstrap pagination">
                        <ul>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
            );
        } else {
            return ""
        }

    }

    handlePageChange(number) {
        this.setState({
            paramBody: {
                firstName: this.state.txtFirstName,
                lastName: this.state.txtLastName,
                mail: this.state.txtMail,
                phoneNumber: this.state.txtPhoneNumber,
                role: this.state.drbRole,
                page: number,
                limit: this.state.drbLimit,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    handleDelete(itemId) {
        this.props.showOverlay(LoadType.deleting)
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/user/${itemId}`,{
            headers: {
                Authorization: Config.Token
            }
        }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            const items = searchList.filter(item => item.id !== itemId)
            if(items.length == 0){
                localStorage.setItem('deleteResult', 'OK');
                window.location.reload()
            }else{
                NotificationManager.success('Success message', 'Delete user successful');
                this.setState({
                    searchList: items
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response.data === 'USER_NOT_FOUND') {
                NotificationManager.error('Error  message', 'User not found');
            }else if (error.response.data === 'IS_ADMIN') {
                NotificationManager.error('Error  message', "Can't delete admin");
            }else{
                NotificationManager.error('Error  message', 'Something wrong');
            }
        });
    }

    showUser(users) {
        var result = null;
        if (users.length > 0) {
            result = users.map((users, index) => {
                return <UserItem users={users} key={index} index={index}
                    onDeleteUser={this.handleDelete}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

    showRoles(roles) {
        var result = null;
        if (roles.length > 0) {
            result = roles.map((roles, index) => {
                return <option key={index} index={index} value={roles.id}>{roles.roleKey}</option>
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        users: state.users,
        roles: state.roles
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllUsers: (paramBody) => {
            dispatch(actFetchUsersRequest(paramBody));
        },
        fetchAllRoles: () => {
            dispatch(actFetchRolesRequest());
        },
        onDeleteUser: (id) => {
            dispatch(actDeleteUserRequest(id));
        },
        showOverlay: (status) => {
            dispatch(actUpdateOverlay(status))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCMS);