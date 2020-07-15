import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class CityItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteCity(id);
        }
    }

    render() {
        var { city, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td style={{width:"30px"}}>{(currentPage - 1)*limit + index + 1}</td>
                <td>{city.name}</td>
                <td>{city.shortDescription}</td>

                <td className="center">
                    <Link to={`/cities/${city.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(city.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default CityItem;
