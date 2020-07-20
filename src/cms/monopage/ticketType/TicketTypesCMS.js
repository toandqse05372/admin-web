import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TicketTypeItem from './components/TicketTypeItem';
import TicketTypeList from './components/TicketTypeList';
import { actDeleteTicketTypeRequest } from '../../../actions/indexTicketTypes';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces'
import axios from 'axios';
import * as Config from '../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import Select from 'react-select'
import callApi from '../../../utils/apiCaller';
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';

class TicketTypesCMS extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.state = {
            loaded: false,
            loadedTable: false,
            searchList: [],
            drbPlaceId: 0,
            txtPlaceName: '',
            selectPlace: 0,
            canExcel: true,

            paramBody: {
                typeName: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.props.fetchAllPlaces()
        let placeId = localStorage.getItem('placeId');
        let placeName = localStorage.getItem('placeName');
        if (placeId != null) {
            this.receivedData(placeId)
            this.setState({
                drbPlaceId: Number(placeId),
                txtPlaceName: placeName,
                loaded: true
            })
        }
    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody);
    }

    onChangePlace = (e) => {
        this.setState({
            drbPlaceId: e.value,
            txtPlaceName: e.label
        });
        this.receivedData(e.value);
        localStorage.setItem('placeId', e.value);
        localStorage.setItem('placeName', e.label);
    }

    receivedData(placeId) {
        this.props.showOverlay(LoadType.loading)
        this.setState({
            searchList: []
        })
        axios.get(Config.API_URL + '/ticketType',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    placeId: placeId
                }
            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                searchList: res.data.listResult,
                loaded: true,
                canExcel: res.data.importExcel
            })
        }).catch(function (error) {
            console.log(error.response);
        });
    }

    onImportExcel() {
        document.getElementById('hiddenFileInput').click();

    }

    uploadExcel = (e) => {
        this.props.showOverlay(LoadType.importing)
        let dataForm = new FormData();
        dataForm.append('file', e.target.files[0]);
        dataForm.append('placeId', localStorage.getItem("placeId"));
        e.target.value = "";
        callApi('upload', 'POST', dataForm).then(res => {
            this.props.showOverlay(LoadType.none)
            localStorage.setItem('excelResult', "OK");
            window.location.reload()
        }).catch(error => {
            if (error.response) {
                if (error.response.data === 'NOT_EXCEL_FILE') {
                    NotificationManager.error('Error  message', 'This is not excel file');
                } else if (error.response.data === 'COULD_NOT_UPLOAD_FILE') {
                    NotificationManager.error('Error  message', 'Could not import file');
                }
                else {
                    window.location.reload();
                    localStorage.setItem('excelResult', error.response.data)
                }
            }else{
                NotificationManager.error('Error  message', 'Something wrong');
            }
            this.props.showOverlay(LoadType.none)
            
        })
    }

    render() {
        var { places } = this.props;
        var { drbPlaceId, loaded, txtPlaceName, canExcel } = this.state;
        var optionsPlace = []
        var renderOptPlace = drbPlaceId
        if (places.length > 0 && !this.state.fetchedPlace) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                optionsPlace.push(option);
                if (drbPlaceId === option.value) {
                    renderOptPlace = i
                }
            }
            loaded = true
        }
        if (loaded) {
            if (localStorage.getItem('excelResult')) {
                const excelResult = localStorage.getItem('excelResult');
                if(excelResult === "OK"){
                    NotificationManager.success('Success message', 'Added code successful');
                    localStorage.removeItem('excelResult');
                }else{
                    NotificationManager.error('Error message', localStorage.getItem('excelResult'));
                    localStorage.removeItem('excelResult');
                }
            }
            if (localStorage.getItem('markType') === "OK") {
                NotificationManager.success('Success message', 'Marked successfully');
                localStorage.removeItem('markType');
            }
            return (
                <div className="container span14">
                    <h1>Ticket Manager</h1>
                    <div className="myDiv">
                        <h3>Place Name: {txtPlaceName} </h3>
                        <div className="rowElement">
                            <Select
                                options={optionsPlace}
                                onChange={this.onChangePlace}
                            />
                        </div>
                    </div>
                    <div style={{ display: drbPlaceId ? "" : "none" }}>

                        <Link to={{
                            pathname: "/ticketTypes/add",
                            state: { placeId: drbPlaceId, placeName: txtPlaceName } }} className="btn btn-primary mb-5 ">
                            <i className="glyphicon glyphicon-plus"></i> Add Ticket Type
                        </Link>

                        {`\t`}

                        {canExcel ? 
                            <button className="btn btn-success mb-5" type="file"
                                onClick={() => this.onImportExcel()}>
                                Import code from excel
                                <input type="file"
                                    id="hiddenFileInput" style={{ display: "none" }}
                                    onChange={this.uploadExcel.bind(this)}
                                /> 
                            </button>
                            : ""}
                        <TicketTypeList>
                            {this.showTicketTypes(this.state.searchList)}
                        </TicketTypeList>


                    </div>
                </div>
            );
        } else
            return ""
    }

    handleChangeStatus(itemId) {
        this.props.showOverlay(LoadType.changing)
        const { searchList } = this.state;
        callApi(`changeTicketType/${itemId}`, 'PUT', null).then(res => {
            if (res) {
                this.props.showOverlay(LoadType.none)
                NotificationManager.success('Success message', 'Change ticket type status successful');
                const updateIndex = searchList.findIndex(item => item.id == itemId)
                let newList = searchList
                newList[updateIndex] = {
                    ...newList[updateIndex],
                    status: newList[updateIndex].status === "ACTIVE" ? "DEACTIVATE" : "ACTIVE"
                }
                this.setState({
                    searchList: newList
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'VISITOR_TYPE_IS_BASIC') {
                    NotificationManager.error('Error  message', 'Containing basic visitor type');
                } 
                else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }else{
                NotificationManager.error('Error  message', 'Something wrong');
            }
        });
    }


    handleDelete(itemId) {
        this.props.showOverlay(LoadType.deleting)
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/ticketType/${itemId}`, {
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            this.props.showOverlay(LoadType.none)
            NotificationManager.success('Success message', 'Delete ticket type successful');
            const items = searchList.filter(item => item.id !== itemId)
            this.setState({
                searchList: items
            })
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'TICKET_TYPE_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Ticket type not found');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }

        });
    }

    showTicketTypes(ticketTypes) {
        var result = null;
        if (ticketTypes.length > 0) {
            result = ticketTypes.map((ticketTypes, index) => {
                return <TicketTypeItem ticketTypes={ticketTypes} key={index} index={index} 
                onChangeStatus={this.handleChangeStatus}
                onDeleteTicketType={this.handleDelete} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        ticketTypes: state.ticketTypes,
        places: state.places,
        visitorTypes: state.visitorTypes
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteTicketType: (id) => {
            dispatch(actDeleteTicketTypeRequest(id));
        },
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        },
        showOverlay: (overlay) => {
            dispatch(actUpdateOverlay(overlay))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypesCMS);