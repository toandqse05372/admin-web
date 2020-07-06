import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VistorTypeItem from './VistorTypeItem'
import VistorTypeList from './VistorTypeList'
import axios from 'axios';
import * as Config from '../../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';

class TicketTypeItem extends Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
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
        }
    }

    onShowVistor = (show) => {
        this.setState({
            showVistor: show
        });
    }

    receivedData(ticketTypeId) {
        axios.get(Config.API_URL + '/visitorType',
            {
                headers: {
                    Authorization: Config.Token
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

    handleDelete(itemId) {
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/visitorType/${itemId}`,{
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            NotificationManager.success('Success message', 'Delete visitor type successful');
            const items = searchList.filter(item => item.id !== itemId)
            this.setState({
                searchList: items
            })
        }).catch(error => {
            if(error.response){
                if(error.response.data === 'VISITOR_TYPE_NOT_FOUND'){
                    NotificationManager.error('Error  message', 'Visitor type not found');
                }else{
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
            
        });
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
