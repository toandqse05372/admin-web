import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CityItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteCity(id);
            window.location.reload();
        }
    }

    render() {
        var { cities, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{(currentPage - 1)*limit + index + 1}</td>
                <td>{cities.name}</td>
                <td>{cities.shortDescription}</td>

                <td className="center">
                    <Link to={`/cities/${cities.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(cities.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default CityItem;