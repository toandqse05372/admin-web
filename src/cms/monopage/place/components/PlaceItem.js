import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PlaceItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeletePlace(id);
        }
    }

    onChangeStatus = (id, str) => {
        if (window.confirm('Are you sure want to '+str+' this ?' )) {
            this.props.onChangeStatusPlace(id);
        }
    }

    render() {
        var { places, index, limit, currentPage, categories } = this.props;
        var categoryList = '';
        for (let i = 0; i < places.categoryId.length; i++) {
            var category = categories.find(x => x.id === places.categoryId[i])
            categoryList = categoryList + category.categoryName;
            if (i < places.categoryId.length - 1) {
                categoryList = categoryList + ', '
            }
        }
        return (
            <tr>
                <td style={{width:"30px"}}>{(currentPage - 1) * limit + index + 1}</td>
                <td>{places.name}</td>
                <td style={{width:"100px"}}>{places.cityName}</td>
                <td>{places.mail}</td>
                <td>{places.phoneNumber}</td>
                <td>{categoryList}</td>
                <td>{places.openingHours}</td>
                <td style={{width:"80px"}}>{places.status}</td>
                {/* <td>{places.shortDescription.split("\n").map((i, key) => {
                    return <div key={key}>- {i}</div>;
                })}</td> */}

                <td style={{width:"200px"}} className="center">
                    {places.status === 'ACTIVE'
                        ? <a style={{width: 60}} className="btn btn-danger" onClick={() => this.onChangeStatus(places.id, 'deactivate')}> Deactivate </a>
                        : <a style={{width: 60}} className="btn btn-primary" onClick={() => this.onChangeStatus(places.id, 'active')}> Active </a>
                    }
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
