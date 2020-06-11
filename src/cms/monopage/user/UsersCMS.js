import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
//import './App.css';
import Pagination from "react-js-pagination";
import { connect } from 'react-redux';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';
import UserItem from './components/UserItem';
import UserList from './components/UserList';
import { actFetchUsersRequest, actDeleteUserRequest, actFetchRolesRequest } from '../../../actions/indexUsers';

class UsersCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            activePage: 1,
            currentPage:1,
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
        debugger
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
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        axios.get(URL.API_URL + '/user/searchMul',
            {
                headers: {
                    Authorization: "Token "+ JSON.parse(localStorage.getItem('tokenLogin'))
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
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems,
                totalPage: res.data.totalPage
            })
        }).catch(function (error) {
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            const pageList = []
            const { txtFirstName, txtLastName, txtPhoneNumber, txtMail, drbRole, drbLimit, currentPage } = this.state;
            var { users } = this.props;
            var { roles } = this.props
            for (let i = 1; i <= this.state.totalPage; i++) {
                pageList.push(i)
            }
            const renderPageNumbers = pageList.map(number => {
                if (number == currentPage) {
                    return (
                        <li className="active" disabled >
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
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
                        <h1>Quản lý người dùng</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Họ </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Họ"
                                            name="txtFirstName"
                                            value={txtFirstName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th><Form.Label id="basic-addon1">Tên </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Tên"
                                            name="txtLastName"
                                            value={txtLastName}
                                            onChange={this.onChange}
                                        /></th>
                                    <th><Form.Label id="basic-addon1">Mail </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Mail"
                                            name="txtMail"
                                            value={txtMail}
                                            onChange={this.onChange}
                                        /></th>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label id="basic-addon1">Số điện thoại </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Số điện thoại"
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
                                            <option key={0} index={0} value={0}>--Chọn Role--</option>
                                            {this.showRoles(roles)}
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Label>Hiển thị</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / trang</option>
                                            <option key={1} index={1} value={15}>15 / trang</option>
                                            <option key={2} index={2} value={20}>20 / trang</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Tìm kiếm
                                        </Button>
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/users/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Thêm người dùng
                    </Link>
                    <UserList>
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
            activePage: number,
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersCMS);