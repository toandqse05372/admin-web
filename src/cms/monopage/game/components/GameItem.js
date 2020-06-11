import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GameItem extends Component {

    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa ?')) { //eslint-disable-line
            this.props.onDeletePark(id);
            window.location.reload();
        }
    }

    render() {
        var { games, index } = this.props;
        return (
            <tr>
                <td>{games.id}</td>
                <td>{games.gameName}</td>
                <td>{games.gameDescription}</td>
                <td>{games.ticketTypeName}</td>
                <td>{games.ticketInventoryStatus}</td>
                <td>{games.park}</td>

                <td className="center">
                    <Link to={`/parks/${games.id}/edit`} className="btn btn-info">
                        <i className="halflings-icon white edit"></i> 
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(games.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>
           
        );
    }
}

export default GameItem;
