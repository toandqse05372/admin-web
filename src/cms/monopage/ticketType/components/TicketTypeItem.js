import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VistorTypeItem from './VistorTypeItem'
import VistorTypeList from './VistorTypeList'
import axios from 'axios';
import * as URL from '../../../../constants/ConfigURL';

class TicketTypeItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showVistor: false,
            visitorTypeList: [],
            loaded: false
        };
    }

    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.props.ticketTypes.id);
    }

    onDeleteTicketType = (id) => {
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

    receivedData(ticketTypeId) {
        axios.get(URL.API_URL + '/visitorType',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    ticketTypeId: ticketTypeId,
                }
            }
        ).then(res => {
            //set state
            this.setState({
                visitorTypeList: res.data
            })
        }).catch(function (error) {
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        var { ticketTypes, index, limit, currentPage,  } = this.props;
        var { showVistor, loaded, visitorTypeList } = this.state;
        if(loaded){
            return (
                <React.Fragment>
                    <tr>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{ticketTypes.typeName}</td>
                        <td className="center">
                            {/* <Link to={`/ticketTypes/vistors/${ticketTypes.id}`} className="btn btn-success">
                            Show visitor type
                        </Link> */}
                            <a className="btn btn-warning" onClick={() => this.onShowVistor(!showVistor)}>
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
                            <Link to={{
                                pathname: "/ticketTypes/vistors/add",
                                state: { id: ticketTypes.id, name: ticketTypes.typeName } // your data array of objects
                            }} className="btn btn-success mb-5 ">
                                <i className="glyphicon glyphicon-plus"></i> Add visitor type
                            </Link>
                            <div  >
                                {/* thứ mà hiện ra sau khi chọn dropdown */}
                                <VistorTypeList>
                                    {this.showVisitorTypes(visitorTypeList)}
                                </VistorTypeList>
    
                            </div>
                        </td>
                    </tr>
    
                </React.Fragment >
    
            );
        }else{
            return ""
        }
    }


    showVisitorTypes(vistorTypes) {
        var result = null;
        var { onDeleteTicketType } = this.props;
        if (vistorTypes.length > 0) {
            result = vistorTypes.map((vistorTypes, index) => {
                return <VistorTypeItem vistors={vistorTypes}
                    key={index} index={index} onDeleteTicketType={onDeleteTicketType} />
            });
        }
        return result;
    }
}





export default TicketTypeItem;
