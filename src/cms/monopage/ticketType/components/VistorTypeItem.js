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
        var { ages, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{(currentPage - 1)*limit + index + 1}</td>
                <td>{ages.name}</td>
                <td>{ages.shortDescription}</td>

                <td className="center">
                    <Link to={`/ages/${ages.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(ages.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default VistorTypeItem;
