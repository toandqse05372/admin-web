import React, { Component } from 'react';

class GameList extends Component {

    render() {
        return (
            <div className="row-fluid sortable">
            <div className="box span12">
                <div className="box-header" data-original-title>
                    <h2><i className="halflings-icon white align-justify" /><span className="break" />Quản lý trò chơi</h2>
                </div>
                <div className="box-content">
                    <table className="table table-striped table-bordered ">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên trò chơi</th>
                                <th>Giới thiệu</th>
                                <th>Ticket Type</th>
                                <th>Công viên</th>
                                <th>Trạng thái</th>
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

export default GameList;
