import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PaymentMethodItem extends Component {

    onDeletePaymentMethod = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeletePaymentMethod(id);
        }
    }

    render() {
        var { method, index, limit, currentPage } = this.props;
        return (
            <tr> 
                <td>{(currentPage - 1)*limit + index + 1}</td>
                <td>{method.methodName}</td>
                <td>{method.status}</td>

                <td className="center">
                    <Link to={`/paymentMethods/${method.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDeletePaymentMethod(method.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default PaymentMethodItem;
