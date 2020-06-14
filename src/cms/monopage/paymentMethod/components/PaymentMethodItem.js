import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PaymentMethodItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeleteCity(id);
            window.location.reload();
        }
    }

    render() {
        var { paymentMethods, index, limit, currentPage } = this.props;
        return (
            <tr> 
                <td>{(currentPage - 1)*limit + index + 1}</td>
                {/* <td>{paymentMethods.name}</td>
                <td>{paymentMethods.status}</td> */}

                <td className="center">
                    <Link to={`/paymentMethods/${paymentMethods.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(paymentMethods.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default PaymentMethodItem;
