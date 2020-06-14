import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TicketTypeItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeleteTicketType(id);
            window.location.reload();
        }
    }

    render() {
        var { ticketTypes, index } = this.props;
        return (
            <tr>
                <td>{ticketTypes.id}</td>
                <td>{ticketTypes.name}</td>
                <td>{ticketTypes.shortDescription}</td>

                <td className="center">
                    <Link to={`/ticketTypes/${ticketTypes.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDeleteTicketType(ticketTypes.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default TicketTypeItem;
