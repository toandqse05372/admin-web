import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PlaceItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeletePlace(id);
            window.location.reload();
        }
    }

    render() {
        var { places, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{(currentPage - 1)*limit + index + 1}</td>
                <td>{places.name}</td>
                <td>{places.city.name}</td>
                <td>{places.address}</td>
                <td>{places.phoneNumber}</td>
                <td>{places.description}</td>

                <td className="center">
                    <Link to={`/places/${places.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(places.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default PlaceItem;
