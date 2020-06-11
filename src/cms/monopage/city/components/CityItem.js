import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CityItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeleteCity(id);
            window.location.reload();
        }
    }

    render() {
        var { cities, index } = this.props;
        return (
            <tr>
                <td>{cities.id}</td>
                <td>{cities.name}</td>
                <td>{cities.shortDescription}</td>

                <td className="center">
                    <Link to={`/parks/${cities.id}/edit`} className="btn btn-info">
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
