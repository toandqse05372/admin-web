import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VisitorTypeItem from './VisitorTypeItem'
import VisitorTypeList from './VisitorTypeList'
import axios from 'axios';
import { connect } from 'react-redux';
import * as Config from '../../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from '../../../../actions/indexOverlay';
import * as LoadType from '../../../../constants/LoadingType';

class TicketTypeItem extends Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            showVisitor: true,
            visitorTypeList: [],
            loaded: false
        };
    }

    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        // this.receivedData(this.props.ticketTypes.id);
        debugger
        this.setState({
            visitorTypeList: this.props.ticketTypes.visitorTypes,
            loaded: true
        })
    }

    onDeleteTicketType = (id) => {
        if (confirm('Are you sure want to delete this ?')) { //eslint-disable-line
            this.props.onDeleteTicketType(id);
        }
    }

    onShowVisitor = (show) => {
        this.setState({
            showVisitor: show
        });
    }

    // receivedData(ticketTypeId) {
    //     axios.get(Config.API_URL + '/visitorType',
    //         {
    //             headers: {
    //                 Authorization: Config.Token
    //             },
    //             params: {
    //                 ticketTypeId: ticketTypeId,
    //             }
    //         }
    //     ).then(res => {
    //         //set state
    //         this.setState({
    //             visitorTypeList: res.data
    //         })
    //     }).catch(function (error) {
    //         console.log(error.response);
    //     });
    //     this.state.loaded = true
    // }

    render() {
        var { ticketTypes, index, limit, currentPage,  } = this.props;
        var { showVisitor, loaded, visitorTypeList } = this.state;
        if(loaded){
            return (
                <React.Fragment>
                    <tr>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{ticketTypes.typeName}</td>
                        <td className="center">
                            {/* <Link to={`/ticketTypes/visitors/${ticketTypes.id}`} className="btn btn-success">
                            Show visitor type
                        </Link> */}
                            {!showVisitor ? 
                            <a className="btn btn-warning" onClick={() => this.onShowVisitor(!showVisitor)}>
                                Show visitor type
                            </a> : 
                            <a className="btn btn-inverse" onClick={() => this.onShowVisitor(!showVisitor)}>
                                Hide visitor type
                            </a>}
                            <Link to={`/ticketTypes/${ticketTypes.id}/edit`} className="btn btn-info">
                                <i className="halflings-icon white edit"></i>
                            </Link>
                            <a className="btn btn-danger" onClick={() => this.onDeleteTicketType(ticketTypes.id)}>
                                <i className="halflings-icon white trash" />
                            </a>
                        </td>
                    </tr>
                    <tr>
    
                        <td colSpan={5} style={{ display: showVisitor ? "" : "none" }}>
                            <Link to={{
                                pathname: "/ticketTypes/visitors/add",
                                state: { id: ticketTypes.id, name: ticketTypes.typeName } // your data array of objects
                            }} className="btn btn-success mb-5 ">
                                <i className="glyphicon glyphicon-plus"></i> Add visitor type
                            </Link>
                            <div  >
                                {/* thứ mà hiện ra sau khi chọn dropdown */}
                                <VisitorTypeList>
                                    {this.showVisitorTypes(visitorTypeList)}
                                </VisitorTypeList>
    
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
        this.props.showOverlay(LoadType.deleting)
        const { visitorTypeList } = this.state;
        axios.delete(Config.API_URL + `/visitorType/${itemId}`,{
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            this.props.showOverlay(LoadType.none)
            NotificationManager.success('Success message', 'Delete visitor type successful');
            const items = visitorTypeList.filter(item => item.id !== itemId)
            this.setState({
                visitorTypeList: items
            })
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if(error.response){
                if(error.response.data === 'VISITOR_TYPE_NOT_FOUND'){
                    NotificationManager.error('Error  message', 'Visitor type not found');
                }else{
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
            
        });
    }

    showVisitorTypes(visitorTypes) {
        var result = null;
        if (visitorTypes !== null) {
            result = visitorTypes.map((visitorType, index) => {
                return <VisitorTypeItem visitorType={visitorType}
                    key={index} index={index} onDeleteTicketType={this.handleDelete} ticketTypeId={this.props.ticketTypes.id} 
                    ticketTypeName={this.props.ticketTypes.typeName}/>
            });
        }
        return result;
    }
}

const mapStateToProps = state => {
    return {
        // ticketTypes: state.ticketTypes,
        // places: state.places,
        // visitorTypes: state.visitorTypes
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        showOverlay: (overlay) => {
            dispatch(actUpdateOverlay(overlay))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypeItem);
