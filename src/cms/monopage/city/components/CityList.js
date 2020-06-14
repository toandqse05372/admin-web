import React, { Component } from 'react';

class CityList extends Component {

    render() {
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Quản lý tỉnh / thành</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tỉnh / thành</th>
                                <th>Giới thiệu ngắn</th>
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

export default CityList;
