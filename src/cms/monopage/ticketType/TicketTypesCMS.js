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
            selectPlace: 0,
            txtTicketTypeName: '',

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
        if (placeId != null) {
            this.receivedData(placeId)
            this.setState({
                drbPlaceId: Number(placeId),
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
            drbPlaceId: e.value
        });
        this.receivedData(e.value);
        localStorage.setItem('placeId', e.value);
    }

    receivedData(placeId) {
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
            //set state
            this.setState({
                searchList: res.data,
                loaded: true
            })
        }).catch(function (error) {
            console.log(error.response);
        });
    }

    render() {
        var { places } = this.props;
        var { drbPlaceId } = this.state;
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
            
        }
        if (this.state.loaded) {
            return (
                <div className="container span14">
                    <h1>Ticket Manager</h1>
                    <div className="myDiv">
                        <label>Place Name </label>
                        <div className="rowElement">
                            <Select
                                options={optionsPlace}
                                defaultValue={optionsPlace[renderOptPlace]}
                                onChange={this.onChangePlace}
                            />
                        </div>
                    </div>
                    <div style={{ display: drbPlaceId ? "" : "none" }}>

                        <Link to="/ticketTypes/add" className="btn btn-success mb-5 ">
                            <i className="glyphicon glyphicon-plus"></i> Add Ticket Type
                        </Link>
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
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/ticketType/${itemId}`, {
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            NotificationManager.success('Success message', 'Delete ticket type successful');
            const items = searchList.filter(item => item.id !== itemId)
            this.setState({
                searchList: items
            })
        }).catch(error => {
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypesCMS);