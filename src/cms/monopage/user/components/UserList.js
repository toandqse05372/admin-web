import React, { Component } from 'react';

class UserList extends Component {

    render() {
        const { totalItems } = this.props
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />User List</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Mail</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                    {
                        totalItems == 0 ? <h4>No result</h4>
                        :""
                    }
                </div>
            </div>{/*/span*/}
        </div>

      
        );
    }

}

export default UserList;
