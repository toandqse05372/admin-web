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
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>{order.name}</td>
                <td>{order.shortDescription}</td>
                <td>{order.detailDescription}</td>

                <td className="center">
                    <a className="btn btn-primary" > Resend ticket </a>
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
