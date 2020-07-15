import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
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
        this.state = {
            loaded: false,
            loadedTable: false,
            activePage: 1,
            drbLimit: 10,
            searchList: [],
            totalItems: 0,
            totalPage: 1,
            currentPage: 1,
            drbPlaceId: 0,
            txtPlaceName: '',
            selectPlace: 0,
            txtTicketTypeName: '',
            canExcel: true,

            paramBody: {
                typeName: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        // this.receivedData(this.state.paramBody);
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

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                typeName: (name === "txtTicketTypeName") ? value : this.state.txtTicketTypeName,
                page: this.state.activePage,
                limit: (name === "drbLimit") ? value : this.state.drbLimit,
            }
        })

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
        callApi('upload', 'POST', dataForm).then(res => {
            this.props.showOverlay(LoadType.none)
            localStorage.setItem('ticketResult', "OK");
            window.location.reload()
        });
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
            if (localStorage.getItem('ticketResult') === "OK") {
                NotificationManager.success('Success message', 'Added code successfully');
                localStorage.removeItem('ticketResult');
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

                        <Link to="/ticketTypes/add" className="btn btn-primary mb-5 ">
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
        var { onDeleteTicketType } = this.props;
        if (ticketTypes.length > 0) {
            result = ticketTypes.map((ticketTypes, index) => {
                return <TicketTypeItem ticketTypes={ticketTypes} limit={this.state.drbLimit}
                    currentPage={this.state.currentPage}
                    key={index} index={index} onDeleteTicketType={this.handleDelete} />
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