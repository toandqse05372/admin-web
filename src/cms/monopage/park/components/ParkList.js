import React, { Component } from 'react';

class ParkList extends Component {

    render() {
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Parks</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered bootstrap-datatable datatable">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Open hours</th>
                                <th>Phone number</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                </div>
            </div>{/*/span*/}
        </div>

      
        );
    }

}

export default ParkList;
