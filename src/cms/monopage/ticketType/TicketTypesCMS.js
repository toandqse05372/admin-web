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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import formatDate from '../../../utils/formatDate'

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
            selectDate: new Date(),
            activeDay: [0, 1],
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
            this.receivedData(placeId, new Date())
            this.setState({
                drbPlaceId: Number(placeId),
                txtPlaceName: placeName
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
        this.receivedData(e.value, this.state.selectDate);
        localStorage.setItem('placeId', e.value);
        localStorage.setItem('placeName', e.label);
    }

    receivedData(placeId, selectDate) {
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
                    placeId: placeId,
                    date: formatDate(selectDate)
                }
            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                searchList: res.data.listResult,
                loaded: true,
                canExcel: res.data.importExcel,
                activeDay: res.data.weekdays
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
        var day = this.state.selectDate.getDay()
        if (!this.state.activeDay.includes(day)) {
            this.props.showOverlay(LoadType.none)
            NotificationManager.error('Error  message', 'Cannot add ticket for this day');
        } else {
            let dataForm = new FormData();
            dataForm.append('file', e.target.files[0]);
            dataForm.append('placeId', localStorage.getItem("placeId"));
            dataForm.append('date', formatDate(this.state.selectDate));
            e.target.value = "";
            callApi('upload', 'POST', dataForm).then(res => {
                this.props.showOverlay(LoadType.none)
                localStorage.setItem('excelResult', "OK");
                this.receivedData(this.state.drbPlaceId, this.state.selectDate)
                NotificationManager.success('Success message', 'Added code successful');
            }).catch(error => {
                if (error.response) {
                    if (error.response.data === 'NOT_EXCEL_FILE') {
                        NotificationManager.error('Error  message', 'This is not excel file');
                    } else if (error.response.data === 'COULD_NOT_UPLOAD_FILE') {
                        NotificationManager.error('Error  message', 'Could not import file');
                    }
                    else {
                        NotificationManager.error('Error message', error.response.data);
                    }
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
                this.receivedData(this.state.drbPlaceId, this.state.selectDate)
                this.props.showOverlay(LoadType.none)
            })
        }
    }

    isWeekday = (Date) => {
        const { activeDay } = this.state;
        const day = Date.getDay();
        var fullList = [0, 1, 2, 3, 4, 5, 6];
        fullList = fullList.filter(val => !activeDay.includes(val));
        return day !== fullList[0] && day !== fullList[1] && day !== fullList[2] &&
            day !== fullList[3] && day !== fullList[4] && day !== fullList[5] && day !== fullList[6]
    }

    changeDate(date) {
        this.setState({ selectDate: date })
        this.receivedData(this.state.drbPlaceId, date.getTime())
    }

    render() {
        var { places } = this.props;
        var { drbPlaceId, loaded, txtPlaceName, canExcel, selectDate } = this.state;
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
                        <div className="datePicker">
                            <div className="myRow">
                                <h3>Date</h3>
                            </div>

                            <div className="myRow">
                                <DatePicker
                                    className="datePicker"
                                    selected={selectDate}
                                    onChange={date => this.changeDate(date)}
                                    filterDate={this.isWeekday}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                />
                            </div>

                        </div>
                    </div>
                    <div style={{ display: drbPlaceId ? "" : "none" }}>

                        <Link to={{
                            pathname: "/ticketTypes/add",
                            state: { placeId: drbPlaceId, placeName: txtPlaceName }
                        }} className="btn btn-primary mb-5 ">
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
            } else {
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