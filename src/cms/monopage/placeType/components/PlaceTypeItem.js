import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PlaceTypeItem extends Component {

    onDeletePlaceType = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeletePlaceType(id);
            window.location.reload();
        }
    }

    render() {
        var { placeTypes, index, currentPage, limit } = this.props;
        return (
            <tr>
                 <td>{(currentPage - 1)*limit + index + 1}</td>
                <td>{placeTypes.placeTypeName}</td>
                <td>{placeTypes.typeKry}</td>

                <td className="center">
                    <Link to={`/placeTypes/${placeTypes.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDeletePlaceType(placeTypes.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default PlaceTypeItem;
