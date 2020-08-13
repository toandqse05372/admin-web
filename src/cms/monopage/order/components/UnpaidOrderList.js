import React, { Component } from 'react';

class OrderList extends Component {

    render() {
        const { totalItems } = this.props
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Unpaid Order List</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Order Code</th>
                                <th>Purchase Day</th>
                                <th>Redemption Day</th>
                                <th>Total Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                    { totalItems == 0 ? <h4>No result</h4> :"" }
                </div>
            </div>
        </div>

      
        );
    }

}

export default OrderList;
