import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import PaymentMethodItem from './components/PaymentMethodItem';
import PaymentMethodList from './components/PaymentMethodList';
import { actDeletePaymentMethodRequest } from '../../../actions/indexPaymentMethod';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';
import PaymentMethods from './PaymentMethods';

class CitiesCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            activePage: 1,
            drbLimit: 10,
            searchList: [],
            totalItems: 0,
            totalPage: 1,
            currentPage: 1,

            txtName: '',

            paramBody: {
                name: '',
                detailDescription: '',
                shortDescription: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.state.paramBody);
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                name: (name === "txtName") ? value : this.state.txtName,
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
        axios.get(URL.API_URL + '/method/searchByName',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    methodName: paramBody.name,
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
            const { txtName, drbLimit, currentPage, searchList } = this.state;
            var { cities } = this.props;
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
                <div className="container span14">
                    <Form onSubmit={this.onSubmitSearch} >
                        <h1>Payment Method Manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Payment Method Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Payment Method Name"
                                            name="txtName"
                                            value={txtName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th>
                                        <Form.Label>Show</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / page</option>
                                            <option key={1} index={1} value={15}>15 / page</option>
                                            <option key={2} index={2} value={20}>20 / page</option>
                                        </Form.Control>
                                    </th>

                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Search
                                        </Button>
                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/paymentMethods/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add payment method
                </Link>
                    <PaymentMethodList>
                        {this.showPaymentMethods(searchList)}
                    </PaymentMethodList>
                    <div className="dataTables_paginate paging_bootstrap pagination">
                        <ul>
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
            );
        } else
            return ""
    }

    handlePageChange(number) {
        this.setState({
            activePage: number,
            paramBody: {
                name: this.state.txtName,
                page: number,
                limit: this.state.drbLimit,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    showPaymentMethods(methods) {
        var result = null;
        var { onDeletePaymentMethod } = this.props;
        if (methods.length > 0) {
            result = methods.map((method, index) => {
                return <PaymentMethodItem method={method} key={index} index={index} 
                onDeletePaymentMethod={onDeletePaymentMethod}
                limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        cities: state.cities
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeletePaymentMethod: (id) => {
            dispatch(actDeletePaymentMethodRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesCMS);