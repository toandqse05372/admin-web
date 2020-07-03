import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PlaceItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeletePlace(id);
            window.location.reload();
        }
    }

    onChangeStatus = (id, str) => {
        if (window.confirm('Are you sure want to '+str+' this ?' )) {
            this.props.onChangeStatusPlace(id);
            window.location.reload();
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
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>{places.name}</td>
                <td>{places.cityName}</td>
                <td>{places.mail}</td>
                <td>{places.phoneNumber}</td>
                <td>{categoryList}</td>
                <td>{places.shortDescription}</td>
                <td>{places.status}</td>
                {/* <td>{places.shortDescription.split("\n").map((i, key) => {
                    return <div key={key}>- {i}</div>;
                })}</td> */}

                <td className="center">
                    {places.status === 'ACTIVE'
                        ? <a style={{width: 50}} className="btn btn-danger" onClick={() => this.onChangeStatus(places.id, 'deactive')}> Deactive </a>
                        : <a style={{width: 50}} className="btn btn-primary" onClick={() => this.onChangeStatus(places.id, 'active')}> Active </a>
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
