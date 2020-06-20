import React, { Component } from 'react';

class VistorTypeList extends Component {

    render() {
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Vistor Type List</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>City Name</th>
                                <th>Short Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      
        );
    }

}

export default VistorTypeList;
