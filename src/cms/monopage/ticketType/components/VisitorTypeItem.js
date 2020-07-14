import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

class VisitorTypeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remaining: 0
        };
    }

    componentWillMount() {
        var { visitorType } = this.props;
        this.setState({
            remaining: visitorType.remaining
        })
    }

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteTicketType(id);
        }
    }

    render() {
        var { visitorType, index, ticketTypeId, ticketTypeName } = this.props;
        var { remaining } = this.state;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{visitorType.typeName}</td>
                <td>{visitorType.price} VNĐ</td>
                <td>{visitorType.typeKey}</td>
                <td>{remaining}</td>
                <td className="center">
                    <Link to={{
                        pathname: `/ticketTypes/visitors/${visitorType.id}/edit`,
                        state: { id: ticketTypeId, name: ticketTypeName } // your data array of objects
                    }} className="btn btn-info">
                        <i className="halflings-icon white edit"></i>
                    </Link>
                    <a className="btn btn-danger" onClick={() => this.onDelete(visitorType.id)}>
                        <i className="halflings-icon white trash" />
                    </a>
                </td>
            </tr>

        );
    }
}



export default VisitorTypeItem;
