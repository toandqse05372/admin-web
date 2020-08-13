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
import callApi from '../../../../utils/apiCaller'

class TicketTypeItem extends Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.state = {
            showVisitor: true,
            visitorTypeList: [],
            loaded: false
        };
    }

    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        // this.receivedData(this.props.ticketTypes.id);
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

    onMarkBasic = (id) => {
        this.props.showOverlay(LoadType.updating)
        let data = new FormData();
        data.append('placeId', localStorage.getItem('placeId'));
        callApi(`markPrice/${id}`, 'PUT', data).then(res => {
            if (res) {
                this.props.showOverlay(LoadType.none)
                localStorage.setItem('markType', "OK");
                window.location.reload()
            }
        }).catch(function (error) {
             this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'VISITOR_TYPE_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Type not found');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
        });
    }

    onChangeStatus = (id, str) => {
        if (window.confirm('Are you sure want to '+str+' this ?' )) {
            this.props.onChangeStatus(id);
        }
    }

    render() {
        var { ticketTypes, index } = this.props;
        var { showVisitor, loaded, visitorTypeList } = this.state;
        if (loaded) {
            return (
                <React.Fragment>
                    <tr>
                        <td style={{ width: "30px" }}>{index + 1}</td>
                        <td>{ticketTypes.typeName}</td>
                        <td>{ticketTypes.status}</td>
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
                                </a>
                            }
                             {ticketTypes.status === 'ACTIVE'
                                ? <a style={{ width: 60 }} className="btn btn-danger" onClick={() => this.onChangeStatus(ticketTypes.id, 'deactivate')}> Deactivate </a>
                                : <a style={{ width: 60 }} className="btn btn-primary" onClick={() => this.onChangeStatus(ticketTypes.id, 'active')}> Active </a>
                            }
                            <Link to={`/ticketTypes/${ticketTypes.placeId}/${ticketTypes.id}/edit`} className="btn btn-info">
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
        } else {
            return ""
        }
    }

    handleDelete(itemId) {
        this.props.showOverlay(LoadType.deleting)
        const { visitorTypeList } = this.state;
        axios.delete(Config.API_URL + `/visitorType/${itemId}`, {
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
            if (error.response) {
                if (error.response.data === 'VISITOR_TYPE_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Visitor type not found');
                } else if (error.response.data === 'VISITOR_TYPE_IS_BASIC') {
                    NotificationManager.error('Error  message', 'Can not delete basic type');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }

        });
    }

    handleChangeStatus(itemId) {
        this.props.showOverlay(LoadType.changing)
        const { visitorTypeList } = this.state;
        callApi(`changeVisitorType/${itemId}`, 'PUT', null).then(res => {
            if (res) {
                this.props.showOverlay(LoadType.none)
                NotificationManager.success('Success message', 'Change visitor type status successful');
                const updateIndex = visitorTypeList.findIndex(item => item.id == itemId)
                let newList = visitorTypeList
                newList[updateIndex] = {
                    ...newList[updateIndex],
                    status: newList[updateIndex].status === "ACTIVE" ? "DEACTIVATE" : "ACTIVE"
                }
                this.setState({
                    visitorTypeList: newList
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'VISITOR_TYPE_IS_BASIC') {
                    NotificationManager.error('Error  message', 'Can not deactivate basic type');
                } 
                else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }else{
                NotificationManager.error('Error  message', 'Something wrong');
            }
        });
    }

    showVisitorTypes(visitorTypes) {
        var result = null;
        if (visitorTypes !== null) {
            result = visitorTypes.map((visitorType, index) => {
                return <VisitorTypeItem visitorType={visitorType}
                    key={index} index={index} onDeleteTicketType={this.handleDelete} 
                    onChangeStatus={this.handleChangeStatus} 
                    ticketTypeId={this.props.ticketTypes.id}
                    ticketTypeName={this.props.ticketTypes.typeName} onMarkBasic={this.onMarkBasic} />
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
