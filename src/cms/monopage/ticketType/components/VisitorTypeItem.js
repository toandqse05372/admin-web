import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VisitorTypeItem extends Component {

    onDelete = (id) => {
        if (window.confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteTicketType(id);
        }
    }

    onMarkBasic = (id) => {
        if (window.confirm('Are you sure want to mark this as basic type?')) {
            this.props.onMarkBasic(id);
        }
    }

    onChangeStatus = (id) => {
        if (window.confirm('Are you sure want to mark this as basic type?')) {
            this.props.onChangeStatus(id);
        }
    }

    render() {
        var { visitorType, index, ticketTypeId, ticketTypeName } = this.props;
        var moneyAdddot = visitorType.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return (
            <tr>
                <td style={{ width: "30px" }}>{index + 1}</td>
                <td>{visitorType.typeName}</td>
                <td>{visitorType.typeKey}</td>
                <td>{moneyAdddot} VNĐ</td>
                <td>{visitorType.remaining}</td>
                <td>{visitorType.status}</td>
                <td style={{ width: "400px" }} className="center">
                    {visitorType.status === 'ACTIVE'
                        ? <a style={{ width: 60 }} className="btn btn-danger" onClick={() => this.onChangeStatus(visitorType.id, 'deactivate')}> Deactivate </a>
                        : <a style={{ width: 60 }} className="btn btn-primary" onClick={() => this.onChangeStatus(visitorType.id, 'active')}> Active </a>
                    }
                    <Link to={{
                        pathname: `/ticketTypes/visitors/a/${visitorType.id}/edit`,
                        state: { id: ticketTypeId, name: ticketTypeName } // your data array of objects
                    }} className="btn btn-info">
                        <i className="halflings-icon white edit"></i>
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(visitorType.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                    {!visitorType.basicType ?
                        <a className="btn btn-primary" onClick={() => this.onMarkBasic(visitorType.id)}>
                            Mark as basic type</a>
                        : ""
                    }
                </td>
            </tr>

        );
    }
}


export default VisitorTypeItem;
