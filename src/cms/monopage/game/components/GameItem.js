import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GameItem extends Component {

    onDelete = (id) => {
        if (window.confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteGame(id);
        }
    }

    onChangeStatus = (id, str) => {
        if (window.confirm('Are you sure want to '+str+' this ?' )) {
            this.props.onChangeStatusGame(id);
        }
    }

    render() {
        var { games, index, limit, currentPage } = this.props;
        return (
            <tr>
                <td style={{width:"30px"}}>{(currentPage - 1) * limit + index + 1}</td>
                <td style={{width: 300}}>{games.gameName}</td>
                {/* <td>{games.gameDescription}</td> */}
                <td>{games.placeName}</td>
                <td style={{width: 60}}>{games.status}</td>
                <td className="center" style={{width: 180}}>
                    {games.status === 'ACTIVE'
                        ? <a style={{width: 60}} className="btn btn-danger" onClick={() => this.onChangeStatus(games.id,'deactivate')}> Deactivate </a>
                        : <a style={{width: 60}} className="btn btn-primary" onClick={() => this.onChangeStatus(games.id,'active')}> Active </a>
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
