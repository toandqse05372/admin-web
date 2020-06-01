import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ParkItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeletePark(id);
        }
    }

    render() {
        var { parks, index } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{parks.name}</td>
                <td>{parks.cityName}</td>
                <td>{parks.openHours}</td>
                <td>{parks.phoneNumber}</td>
                <td>{parks.shortDescription}</td>

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
