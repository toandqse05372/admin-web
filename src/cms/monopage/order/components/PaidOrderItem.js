import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OrderItem extends Component {

    onDeleteOrder = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteOrder(id);
            window.location.reload();
        }
    }

    render() {
        var { order, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{order.orderCode}</td>
                <td>{order.purchaseDay}</td>
                <td>{order.totalPayment} VNĐ</td>

                <td className="center">
                    <a className="btn btn-primary" > Send ticket </a>
                    <Link to={`/orders/${order.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i>
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDeleteOrder(order.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>

        );
    }
}

export default OrderItem;
