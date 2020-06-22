import React, { Component } from 'react';

class PlaceList extends Component {

    render() {
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Place List</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Place Name</th>
                                <th>City</th>
                                <th>Mail</th>
                                <th>Phone Number</th>
                                <th>Category</th>
                                <th>Short Description</th>
                                <th>Status</th>
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

export default PlaceList;