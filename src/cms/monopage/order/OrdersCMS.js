import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import OrderItem from './components/OrderItem';
import OrderList from './components/OrderList';
import { actDeleteOrderRequest } from '../../../actions/indexOrders';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';

class OrdersCMS extends Component {
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

            txtCityName: '',

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
                name: (name === "txtCityName") ? value : this.state.txtCityName,
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
        axios.get(URL.API_URL + '/city/searchByName',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    name: paramBody.name,
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
            const { txtCityName, drbLimit, currentPage } = this.state;
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
                        <h1>Order manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        <Form.Label>Sort by</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={"purchase_day"}>Newest</option>
                                            <option key={1} index={1} value={"total_payment"}>Amount</option>
                                        </Form.Control>
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
                                            Apply
                                        </Button>
                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <OrderList>
                        {/* {this.showCities(this.state.searchList)} */}
                    </OrderList>
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
                name: this.state.txtCityName,
                page: number,
                limit: this.state.drbLimit,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    showCities(cities) {
        var result = null;
        var { onDeleteCity } = this.props;
        if (cities.length > 0) {
            result = cities.map((cities, index) => {
                return <OrderItem cities={cities} key={index} index={index} onDeleteCity={onDeleteCity}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        orders: state.orders
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteOrder: (id) => {
            dispatch(actDeleteOrderRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersCMS);