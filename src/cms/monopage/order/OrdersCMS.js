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
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';
import callApi from '../../../utils/apiCaller'
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces'

class OrdersCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            searchList: [],
            txtOrderPaid: '',
            txtOrderUnpaid: '',
            txtOrderSent: '',
            fetchedPlace: false,

            tabIndex: 0,
            txtStatus: 'PAID',
            paramBody: {
                code: '',
            }
        }
        this.sendTicket = this.sendTicket.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.props.fetchAllPlaces()
        let placeId = localStorage.getItem('placeIdOrder');
        let placeName = localStorage.getItem('placeNameOrder');
        if (placeId != null) {
            this.receivedData(this.state.paramBody, this.state.txtStatus, placeId);
            this.setState({
                drbPlaceId: Number(placeId),
                txtPlaceName: placeName
            })
        }

    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                code: value
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody, this.state.txtStatus);
    }

    onChangePlace = (e) => {
        this.setState({
            drbPlaceId: e.value,
            txtPlaceName: e.label
        });
        this.receivedData(this.state.paramBody, this.state.txtStatus, e.value);
        localStorage.setItem('placeIdOrder', e.value);
        localStorage.setItem('placeNameOrder', e.label);
    }

    onChangeTab(tabIndex) {
        var status = null
        if (tabIndex === 0) {
            status = 'PAID'
        } else if (tabIndex === 1) {
            status = 'UNPAID'
        } else {
            status = 'SENT'
        }
        this.setState({
            tabIndex: tabIndex,
            txtStatus: status
        })
        this.receivedData(this.state.paramBody, status)
    }

    receivedData(paramBody, status, placeId) {
        this.props.showOverlay(LoadType.loading)
        axios.get(URL.API_URL + '/order/searchByStatus',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    status: status,
                    code: paramBody.code,
                    placeId: placeId
                }
            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                searchList: res.data.listResult,
                loaded: true
            })
        }).catch(function (error) {
            this.props.showOverlay(LoadType.none)
            console.log(error.response);
        });
    }

    render() {
        var { loaded, txtOrderPaid, txtOrderUnpaid, txtOrderSent, searchList, txtPlaceName, drbPlaceId, fetchedPlace } = this.state;
        var { places } = this.props
        var optionsPlace = []
        var renderOptPlace = drbPlaceId
        if (places.length > 0 && !fetchedPlace) {
            optionsPlace.push({ value: 0, label: 'All' });
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                optionsPlace.push(option);
                if (drbPlaceId === option.value) {
                    renderOptPlace = i
                }
            }
            fetchedPlace = true
        }
        if (fetchedPlace) {
            if (localStorage.getItem('sendStatus')) {
                if (localStorage.getItem('sendStatus') === 'OK') {
                    NotificationManager.success('Success message', 'Send ticket successful');
                }
                if (localStorage.getItem('sendStatus') === 'ORDER_EXPIRED') {
                    NotificationManager.error('Error message', 'Booking date has been passed');
                }
                localStorage.removeItem('sendStatus')
            }
            return (
                <React.Fragment>
                    <div style={{ marginBottom: '30px' }}>
                        <h1>Order Manager</h1>
                    </div>
                    <div className="myDiv">
                        <h3>Place Name: {txtPlaceName} </h3>
                        <div className="rowElement">
                            <Select
                                options={optionsPlace}
                                onChange={this.onChangePlace}
                            />
                        </div>
                    </div>   
                    {loaded ?  <Tabs selectedIndex={this.state.tabIndex}
                        onSelect={tabIndex => this.onChangeTab(tabIndex)}>

                        <TabList>
                            <Tab>Show paid orders</Tab>
                            <Tab>Show unpaid orders</Tab>
                            <Tab>Show sent orders</Tab>
                        </TabList>
                        <TabPanel>
                            <Form onSubmit={this.onSubmitSearch} >
                                <Form.Label id="basic-addon1">Order Code </Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Order code"
                                    name="txtOrderPaid"
                                    value={txtOrderPaid}
                                    onChange={this.onChange}
                                />
                                <Button
                                    style={{ marginBottom: '10px', height: '32px' }}
                                    type="Submit"
                                    className="btn btn-inverse mb-5">
                                    Search
                        </Button>
                            </Form>
                            <PaidOrderList totalItems={searchList.length}>
                                {this.showPaid(searchList)}
                            </PaidOrderList>
                        </TabPanel>
                        <TabPanel>
                            <Form onSubmit={this.onSubmitSearch} >
                                <Form.Label id="basic-addon1">Order Code </Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Order code"
                                    name="txtOrderUnpaid"
                                    value={txtOrderUnpaid}
                                    onChange={this.onChange}
                                />
                                <Button
                                    style={{ marginBottom: '10px', height: '32px' }}
                                    type="Submit"
                                    className="btn btn-inverse mb-5">
                                    Search
                        </Button>
                            </Form>
                            <UnpaidOrderList totalItems={searchList.length}>
                                {this.showUnpaid(searchList)}
                            </UnpaidOrderList>
                        </TabPanel>
                        <TabPanel>
                            <Form onSubmit={this.onSubmitSearch} >
                                <Form.Label id="basic-addon1">Order Code </Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Order code"
                                    name="txtOrderSent"
                                    value={txtOrderSent}
                                    onChange={this.onChange}
                                />
                                <Button
                                    style={{ marginBottom: '10px', height: '32px' }}
                                    type="Submit"
                                    className="btn btn-inverse mb-5">
                                    Search
                        </Button>
                            </Form>
                            <SentOrderList totalItems={searchList.length}>
                                {this.showSent(searchList)}
                            </SentOrderList>
                        </TabPanel>
                    </Tabs>
                    : ""}           
                </React.Fragment>

            );
        } else
            return ""
    }

    handleDelete(id) {
        this.props.showOverlay(LoadType.deleting)
        const { searchList } = this.state;
        callApi(`order/${id}`, 'DELETE', null).then(res => {
            this.props.showOverlay(LoadType.none)
            NotificationManager.success('Success message', 'Delete orrder successful');
            const items = searchList.filter(item => item.id !== id)
            this.setState({
                searchList: items
            })
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response.data === 'ORDER_NOT_FOUND') {
                NotificationManager.error('Error  message', 'Order not found');
            } else {
                NotificationManager.error('Error  message', 'Something wrong');
            }
        });
    }

    sendTicket(id) {
        this.props.showOverlay(LoadType.loading)
        const { searchList, tabIndex } = this.state;
        var printRequest = {
            orderId: id,
            type: tabIndex
        }
        callApi(`order/sendTicket`, 'POST', printRequest).then(res => {
            if (tabIndex < 2) {
                const items = searchList.filter(item => item.id !== id)
                this.setState({
                    searchList: items
                })
            }
            this.props.showOverlay(LoadType.none)
            NotificationManager.success('Success message', 'Send ticket successful');
        }).catch(error => {
            if (error.response) {
                if (error.response.data === 'CODE_NOT_ENOUGH') {
                    NotificationManager.error('Please add more code', 'Code is not enough to send');
                } else if (error.response.data === 'ORDER_EXPIRED') {
                    const items = searchList.filter(item => item.id !== id)
                    this.setState({
                        searchList: items
                    })
                    NotificationManager.error('Error message', 'Booking date has been passed');
                }
                else {
                    NotificationManager.error('Error message', 'Something wrong');
                }
            }
            else {
                NotificationManager.error('Error message', 'Something wrong');
            }
            this.props.showOverlay(LoadType.none)
        });
    }

    showPaid(orders) {
        var result = null;
        if (orders.length > 0) {
            result = orders.map((order, index) => {
                return <PaidOrderItem order={order} key={order} index={index} onDeleteOrder={this.handleDelete}
                    limit={this.state.drbLimit}
                    sendTicket={this.sendTicket}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

    showUnpaid(orders) {
        var result = null;
        if (orders.length > 0) {
            result = orders.map((order, index) => {
                return <UnpaidOrderItem order={order} key={order} index={index} onDeleteOrder={this.handleDelete}
                    limit={this.state.drbLimit}
                    sendTicket={this.sendTicket}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

    showSent(orders) {
        var result = null;
        if (orders.length > 0) {
            result = orders.map((order, index) => {
                return <SentOrderItem order={order} key={order} index={index} onDeleteOrder={this.handleDelete}
                    limit={this.state.drbLimit}
                    sendTicket={this.sendTicket}
                    currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        orders: state.orders,
        places: state.places
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteOrder: (id) => {
            dispatch(actDeleteOrderRequest(id));
        },
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        },
        showOverlay: (overlay) => {
            dispatch(actUpdateOverlay(overlay))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersCMS);