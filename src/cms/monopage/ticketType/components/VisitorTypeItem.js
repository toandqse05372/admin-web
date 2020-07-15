import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VisitorTypeItem extends Component {

    onDelete = (id) => {
        if (window.confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteTicketType(id);
        }
    }

    onMarrkBasic = (id) => {
        if (window.confirm('Are you sure want to mark this as basic type?')) { 
            this.props.onMarrkBasic(id);
        }
    }

    render() {
        var { visitorType, index, ticketTypeId, ticketTypeName } = this.props;
        return (
            <tr>
                <td style={{width:"30px"}}>{index + 1}</td>
                <td>{visitorType.typeName}</td>
                <td>{visitorType.typeKey}</td>
                <td>{visitorType.price} VNĐ</td>
                <td>{visitorType.remaining}</td>
                <td style={{width:"400px"}} className="center">
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
                        <a className="btn btn-primary" onClick={() => this.onMarrkBasic(visitorType.id)}>
                            Mark as basic type</a>
                        : ""
                    }
                </td>
            </tr>

        );
    }
}


export default VisitorTypeItem;
