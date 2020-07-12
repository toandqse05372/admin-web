import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OrderDetailItem extends Component {


    render() {
        var { product, index, name } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name} [{product.visitorType.typeName}]</td>
                <td>{product.quantity}</td>
            </tr>

        );
    }
}

export default OrderDetailItem;
