import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OrderDetailItem extends Component {


    render() {
        var { orderItem, index, name } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name} [{orderItem.visitorTypeName}]</td>
                <td>{orderItem.visitorTypeKey}</td>
                <td>{orderItem.quantity}</td>
            </tr>

        );
    }
}

export default OrderDetailItem;
