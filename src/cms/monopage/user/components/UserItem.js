import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeleteUser(id);
            window.location.reload();
        }
    }

    render() {
        var { users } = this.props;
        return (
            <tr>
                <td>{users.id}</td>
                <td>{users.firstName}</td>
                <td>{users.lastName}</td>
                <td>{users.mail}</td>
                <td>{users.phoneNumber}</td>
                <td>{users.roleKey}</td>

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
