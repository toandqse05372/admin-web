import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actGetOrderRequest } from '../../../actions/indexOrders';
import OrderDetailList from './components/OrderDetailList';
import OrderDetailItem from './components/OrderDetailItem';
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';
import callApi from '../../../utils/apiCaller'
import { NotificationManager } from 'react-notifications';
import formatDate from '../../../utils/formatDate'

class OrderActionCMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtShortDescription: '',
            txtDetailDescription: '',
            orderInfor: null,
            loaded: false,
            orderItems: []
        };
    }

    componentWillMount() {
        var { match } = this.props;
        if (match) { // update
            var id = match.params.id;
            this.props.onEditOrder(id)
        } // else => add
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            if (typeof itemEditing.id !== "undefined") {
                this.setState({
                    id: itemEditing.id,
                    txtName: itemEditing.ticketTypeName,
                    orderInfor: itemEditing,
                    orderItems: itemEditing.orderItems,
                    loaded: true
                })
            }
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
        var { id, txtName, txtShortDescription, txtDetailDescription } = this.state;
        var order = {
            id: id,
            name: txtName,
            shortDescription: txtShortDescription,
            detailDescription: txtDetailDescription
        };
        if (id) {
            this.props.onUpdateOrder(order);
        } else {
            this.props.onAddOrder(order);
        }
    }

    render() {
        var { orderItems, orderInfor, loaded } = this.state;
        if (loaded) {
            var status = orderInfor.status === 'SENT' ? 2 : 1;
            var buttenName = orderInfor.status === 'SENT' ? 'Resend Ticket' : 'Send Ticket'
            var moneyAdddot = orderInfor.totalPayment.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            return (
                <div className="container">
                    <legend>* Order #{orderInfor.orderCode}</legend>
                    <div className="form-group"><label>Name: {orderInfor.firstName} {orderInfor.lastName}</label></div>
                    <div className="form-group"><label>Mail: {orderInfor.mail}</label></div>
                    <div className="form-group"><label>Phone number: {orderInfor.phoneNumber}</label></div>
                    <div className="form-group"><label>Purchase Day: {formatDate(orderInfor.purchaseDay)}</label></div>
                    <div className="form-group"><label>Redemption Day: {formatDate(orderInfor.redemptionDate)}</label></div>
                    <div className="form-group"><label>Total Payment: {moneyAdddot} VNĐ</label></div>
                    <div className="form-group"><h3>Status: {orderInfor.status}</h3></div>
                    <div style={{ width: "600px" }}>
                        <OrderDetailList>
                            {this.showOrderItem(orderItems)}
                        </OrderDetailList>
                    </div>
                    <Link to="/orders" className="btn btn-danger mr-5">
                        <i className="glyphicon glyphicon-arrow-left"></i> Back
                        </Link>
                    <a className="btn btn-primary" onClick={() => this.sendTicket(orderInfor.id, status)}>
                        <i className="glyphicon glyphicon-save"></i> {buttenName}
                        </a>
                </div>
            );
        } else
            return ""
    }

    sendTicket(id, status) {
        this.props.showOverlay(LoadType.loading)
        var printRequest = {
            orderId: id,
            type: status
        }
        callApi(`order/sendTicket`, 'POST', printRequest).then(res => {
            this.props.showOverlay(LoadType.none)
            localStorage.setItem('sendStatus', 'OK')
            this.props.history.goBack()
        }).catch(error => {
            if (error.response) {
                if (error.response.data === 'CODE_NOT_ENOUGH') {
                    NotificationManager.error('Please add more code', 'Code is not enough to send');
                } else if (error.response.data === 'ORDER_EXPIRED') {
                    this.props.showOverlay(LoadType.none)
                    localStorage.setItem('sendStatus', 'ORDER_EXPIRED')
                    this.props.history.goBack()
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

    showOrderItem(orderItems) {
        var result = null;
        if (orderItems.length > 0) {
            result = orderItems.map((orderItem, index) => {
                return <OrderDetailItem orderItem={orderItem} key={orderItem} index={index} name={this.state.txtName} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onEditOrder: (id) => {
            dispatch(actGetOrderRequest(id));
        },
        showOverlay: (overlay) => {
            dispatch(actUpdateOverlay(overlay))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderActionCMS);
