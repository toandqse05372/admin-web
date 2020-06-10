import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ParkItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeletePark(id);
            window.location.reload();
        }
    }

    render() {
        var { parks, index } = this.props;
        return (
            <tr>
                <td>{parks.id}</td>
                <td>{parks.name}</td>
                <td>{parks.cityId}</td>
                <td>{parks.address}</td>
                <td>{parks.phoneNumber}</td>
                <td>{parks.description}</td>

                <td className="center">
                    <Link to={`/parks/${parks.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(parks.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default ParkItem;
