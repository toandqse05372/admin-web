import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeleteUser(id);
        }
    }

    render() {
        var { users, index } = this.props;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{users.name}</td>
                <td>{users.cityId}</td>
                <td>{users.openHours}</td>
                <td>{users.phoneNumber}</td>
                <td>{users.shortDescription}</td>

                <td className="center">
                    <Link to={`/users/${users.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(users.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default UserItem;
