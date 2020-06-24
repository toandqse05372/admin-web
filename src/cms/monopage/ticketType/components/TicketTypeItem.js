import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VistorTypeItem from './VistorTypeItem'
import VistorTypeList from './VistorTypeList'

class TicketTypeItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showVistor: false
        };
    }

    onDelete = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteTicketType(id);
            window.location.reload();
        }
    }

    onShowVistor = (show) => {
        this.setState({
            showVistor: show
        });
    }

    render() {
        var { ticketTypes, index } = this.props;
        var {showVistor} = this.state;
        return (
            <React.Fragment>
                <tr>
                    <td>{ticketTypes.id}</td>
                    <td>Vé vào cổng công viên mặt trời</td>
                    <td>{ticketTypes.shortDescription}</td>
                    <td></td>
                    <td className="center">
                        {/* <Link to={`/ticketTypes/vistors/${ticketTypes.id}`} className="btn btn-success">
                        Show visitor type
                    </Link> */}
                        <a className="btn btn-danger" onClick={() => this.onShowVistor(!showVistor)}>
                            Show vistor type
                        </a>
                        <Link to={`/ticketTypes/${ticketTypes.id}/edit`} className="btn btn-info">
                            <i className="halflings-icon white edit"></i>
                        </Link>
                        <a className="btn btn-danger" onClick={() => this.onDeleteTicketType(ticketTypes.id)}>
                            <i className="halflings-icon white trash" />
                        </a>
                    </td>
                </tr>
                <tr>
                    
                    <td colSpan={5} style={{ display: showVistor ? "" : "none" }}>
                    <Link to="/vistors/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add visitor type
                    </Link>
                        <div  >
                            {/* thứ mà hiện ra sau khi chọn dropdown */}
                            <VistorTypeList>
                                <VistorTypeItem />
                            </VistorTypeList>

                        </div>
                    </td>
                </tr>

            </React.Fragment>

        );
    }
}

export default TicketTypeItem;
