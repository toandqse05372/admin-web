import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import UnpaidOrderItem from './components/UnpaidOrderItem';
import UnpaidOrderList from './components/UnpaidOrderList';
import PaidOrderItem from './components/PaidOrderItem';
import PaidOrderList from './components/PaidOrderList';
import SentOrderItem from './components/SentOrderItem';
import SentOrderList from './components/SentOrderList';
import { actDeleteOrderRequest } from '../../../actions/indexOrders';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';
import 'react-tabs/style/react-tabs.css';

class OrdersCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            activePage: 1,
            drbLimit: 10,
            searchListPaid: [],
            searchListUnpaid: [],
            searchListSent: [],
            totalItems: 0,
            totalPage: 1,
            currentPage: 1,

            txtOrderCode: '',

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
                name: (name === "txtOrderCode") ? value : this.state.txtOrderCode,
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
            const { txtOrderCode, drbLimit, currentPage } = this.state;
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
                <Tabs defaultIndex={0}>
                    <h1>Order Manager</h1>
                    <br></br>
                    <Form.Label id="basic-addon1">Order Code </Form.Label>
                    <FormControl
                        type="text"
                        placeholder="Order code"
                        name="txtOrderCode"
                        value={txtOrderCode}
                        onChange={this.onChange}
                    />
                    <Button
                        type="Submit"
                        className="btn btn-inverse mb-5">
                        Search
                        </Button>
                     <br></br>
                     <br></br>
                    <TabList>
                        <Tab>Show paid orders</Tab>
                        <Tab>Show unpaid orders</Tab>
                        <Tab>Show sent orders</Tab>
                    </TabList>
                    <TabPanel>
                        <PaidOrderList>
                            {this.showPaid(this.state.searchList)}
                        </PaidOrderList>
                    </TabPanel>
                    <TabPanel>
                        <UnpaidOrderList>
                            {this.showUnpaid(this.state.searchList)}
                        </UnpaidOrderList>
                    </TabPanel>
                    <TabPanel>
                        <SentOrderList>
                            {this.showSent(this.state.searchList)}
                        </SentOrderList>
                    </TabPanel>
                </Tabs>
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

    showPaid(orders) {
        var result = null;
        var { onDeleteOrder } = this.props;
        if (orders.length > 0) {
            result = orders.map((order, index) => {
                return <PaidOrderItem order={order} key={order} index={index} onDeleteOrder={onDeleteOrder}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

    showUnpaid(orders) {
        var result = null;
        var { onDeleteOrder } = this.props;
        if (orders.length > 0) {
            result = orders.map((order, index) => {
                return <UnpaidOrderItem order={order} key={order} index={index} onDeleteOrder={onDeleteOrder}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

    showSent(orders) {
        var result = null;
        var { onDeleteOrder } = this.props;
        if (orders.length > 0) {
            result = orders.map((order, index) => {
                return <SentOrderItem order={order} key={order} index={index} onDeleteOrder={onDeleteOrder}
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