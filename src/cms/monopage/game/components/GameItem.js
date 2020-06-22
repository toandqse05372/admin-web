import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GameItem extends Component {

    onDelete = (id) => {
        if (window.confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteGame(id);
            window.location.reload();
        }
    }

    onChangeStatus = (id, str) => {
        if (window.confirm('Are you sure want to '+str+' this ?' )) {
            this.props.onChangeStatusGame(id);
            window.location.reload();
        }
    }

    render() {
        var { games, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>{games.gameName}</td>
                <td>{games.gameDescription}</td>
                <td>{games.placeName}</td>
                <td>{games.status}</td>
                <td className="center">
                    {games.status === 'ACTIVE'
                        ? <a className="btn btn-danger" onClick={() => this.onChangeStatus(games.id,'deactive')}> Deactive </a>
                        : <a className="btn btn-primary" onClick={() => this.onChangeStatus(games.id,'active')}> Active </a>
                    }
                    <Link to={`/games/${games.id}/edit`} className="btn btn-info">
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