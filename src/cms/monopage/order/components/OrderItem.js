import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OrderItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteOrder(id);
            window.location.reload();
        }
    }

    render() {
        var { orders, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{(currentPage - 1)*limit + index + 1}</td>
                <td>{orders.name}</td>
                <td>{orders.shortDescription}</td>

                <td className="center">
                    <Link to={`/orders/${orders.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(orders.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default OrderItem;
