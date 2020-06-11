import React, { Component } from 'react';

class ParkList extends Component {

    render() {
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Danh sách công viên</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên công viên</th>
                                <th>Tỉnh / Thành</th>
                                <th>Mail</th>
                                <th>Số điện thoại</th>
                                <th>Giới thiệu</th>
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
