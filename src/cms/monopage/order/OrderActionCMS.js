import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actAddOrderRequest, actUpdateOrderRequest, actGetOrderRequest } from '../../../actions/indexOrders';
import { Form } from 'react-bootstrap'
import OrderDetailList from './components/OrderDetailList';
import OrderDetailItem from './components/OrderDetailItem';

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
            this.setState({
                id: itemEditing.id,
                txtName: itemEditing.ticketTypeName,
                orderInfor: itemEditing,
                orderItems: itemEditing.orderItems,
                loaded: true
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
        var { orderItems, txtShortDescription,
            txtDetailDescription, orderInfor, loaded } = this.state;
        if (this.state.loaded) {
            return (
                <div className="container">
                    <form onSubmit={this.onSubmit}>
                        <legend>* Order {orderInfor.orderCode}</legend>
                        <div className="form-group">
                            <label>Name: {orderInfor.firstName} {orderInfor.lastName}</label>
                        </div>
                        <div className="form-group">
                            <label>Mail: {orderInfor.mail}</label>
                        </div>
                        <div className="form-group">
                            <label>Phone number: {orderInfor.phoneNumber}</label>
                        </div>
                        <div className="form-group">
                            <label>Total Payment: {orderInfor.totalPayment} VNĐ</label>
                        </div>
                        <div style={{width: "600px"}}>
                        <OrderDetailList>
                            {this.showOrderItem(orderItems)}
                        </OrderDetailList>
                        </div>
                        
                        <Link to="/orders" className="btn btn-danger mr-5">
                            <i className="glyphicon glyphicon-arrow-left"></i> Back
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            <i className="glyphicon glyphicon-save"></i> Send Ticket
                                </button>
                    </form>
                </div>
            );
        } else
            return ""
    }

    showOrderItem(orderItems) {
        var result = null;
        if (orderItems.length > 0) {
            result = orderItems.map((orderItem, index) => {
                return <OrderDetailItem orderItem={orderItem} key={orderItem} index={index} name={this.state.txtName}/>
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
        onAddOrder: (order) => {
            dispatch(actAddOrderRequest(order, props.history));
        },
        onUpdateOrder: (order) => {
            dispatch(actUpdateOrderRequest(order, props.history));
        },
        onEditOrder: (id) => {
            dispatch(actGetOrderRequest(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderActionCMS);
