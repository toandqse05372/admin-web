import React, { Component } from 'react';

class SaleItem extends Component {

    render() {
        var { sale, index } = this.props;
        var moneyAdddot = sale.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return (
            <tr>
                <td style={{width:"30px"}}>{index + 1}</td>
                <td>{sale.ticketTypeName}</td>
                <td>{sale.quantity}</td>
                <td>{sale.remaining}</td>
                <td>{moneyAdddot} VNĐ</td>
            </tr>
           
        );
    }
}

export default SaleItem;
