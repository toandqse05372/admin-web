import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserItem extends Component {

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteUser(id);
        }
    }

    render() {
        var { users, index, limit, currentPage } = this.props;
        var roleList = '';
        for (let i = 0; i < users.roleKey.length; i++) {
            var role = users.roleKey[i]
            roleList = roleList + role;
            if (i < users.roleKey.length - 1) {
                roleList = roleList + ', '
            }
        }
        return (
            <tr>
                <td style={{width:"30px"}}>{(currentPage - 1)*limit + index + 1}</td>
                <td>{users.firstName}</td>
                <td>{users.lastName}</td>
                <td>{users.mail}</td>
                <td>{users.phoneNumber}</td>
                <td>{roleList}</td>

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
