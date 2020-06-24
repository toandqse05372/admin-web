import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VistorTypeItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteCity(id);
            window.location.reload();
        }
    }

    render() {
        var { vistors, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>Trẻ em</td>
                <td>100.000 VNĐ</td>
                <td>KID100</td>

                <td className="center">
                    <a className="btn btn-success mb-5" onClick={() => this.onDelete(vistors.id)}>
                        Import code from excel
                    </a>
                    <Link to={`/vistors/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i>
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(vistors.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>

        );
    }
}

export default VistorTypeItem;
