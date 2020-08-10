import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PlaceTypeItem extends Component {

    onDeleteCategory = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteCategory(id);
        }
    }

    render() {
        var { category, index, currentPage, limit } = this.props;
        return (
            <tr>
                <td style={{width:"30px"}}>{(currentPage - 1)*limit + index + 1}</td>
                <td>{category.categoryName}</td>
                <td>{category.description}</td>
                <td className="center">
                    <Link to={`/categories/${category.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDeleteCategory(category.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default PlaceTypeItem;
