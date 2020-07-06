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
            drbPlaceId: '',
            txtTicketTypeName: '',

            paramBody: {
                name: '',
                detailDescription: '',
                shortDescription: '',
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        // this.receivedData(this.state.paramBody);
        this.props.fetchAllPlaces()
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
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        axios.get(Config.API_URL + '/ticketType/searchTypeName',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    typeName: paramBody.typeName,
                    page: paramBody.page,
                    limit: paramBody.limit,
                }
            }
        ).then(res => {
            //set state
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems,
            })
        }).catch(function (error) {
            console.log(error.response);
        });
        this.state.loadedTable = true
    }

    render() {
        var { places } = this.props;
        var { drbPlaceId, loaded, drbGameId } = this.state;
        var optionsPlace = []
        var renderOptPlace = drbPlaceId
        if (places.length > 0 && !this.state.fetchedPlace) {
            for (let i = 0; i < places.length; i++) {
                var option = { value: places[i].id, label: places[i].name }
                optionsPlace.push(option);
                if (drbPlaceId === places[i].id) {
                    debugger
                    renderOptPlace = i
                }
            }
            loaded = true;
        }
        if (loaded) {
            const pageList = []
            const { txtTicketTypeName, drbLimit, currentPage } = this.state;
            for (let i = 1; i <= this.state.totalPage; i++) {
                pageList.push(i)
            }
            const renderPageNumbers = pageList.map(number => {
                if (number == currentPage) {
                    return (
                        <li className="active" disabled >
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
                        </li>
                    );
                } else
                    return (
                        <li className='pointer'>
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
                        </li>
                    );
            });
            return (
                <div className="container span14">
                    <h1>Ticket Manager</h1>
                    <div className="myDiv">
                        <label>Place Name </label>
                        <div >
                            <Select
                                options={optionsPlace}
                                defaultValue={optionsPlace[renderOptPlace]}
                                onChange={this.onChangePlace}
                            />
                        </div>
                    </div>
                    <div style={{ display: drbPlaceId ? "" : "none" }}>
                        <Form onSubmit={this.onSubmitSearch} >
                            <Table>
                                <thead>
                                    <tr>
                                        <th><Form.Label id="basic-addon1">Ticket Type Name</Form.Label>
                                            <FormControl
                                                type="text"
                                                placeholder="Ticket Type Name"
                                                name="txtTicketTypeName"
                                                value={txtTicketTypeName}
                                                onChange={this.onChange}
                                            />
                                        </th>
                                        <th>
                                            <Form.Label>Show</Form.Label>
                                            <Form.Control as="select"
                                                name="drbLimit"
                                                value={drbLimit}
                                                onChange={this.onChange}>
                                                <option key={0} index={0} value={10}>10 / page</option>
                                                <option key={1} index={1} value={15}>15 / page</option>
                                                <option key={2} index={2} value={20}>20 / page</option>
                                            </Form.Control>
                                        </th>

                                    </tr>
                                    <tr>
                                        <td>
                                            <Button
                                                type="Submit"
                                                className="btn btn-inverse mb-5">
                                                Search
                                        </Button>
                                        </td>
                                    </tr>
                                </thead>
                            </Table>
                        </Form>
                        <Link to="/ticketTypes/add" className="btn btn-success mb-5 ">
                            <i className="glyphicon glyphicon-plus"></i> Add Ticket Type
                </Link>
                        <TicketTypeList>
                            {this.showTicketTypes(this.state.searchList)}
                        </TicketTypeList>
                        <div className="dataTables_paginate paging_bootstrap pagination">
                            <ul>
                                {renderPageNumbers}
                            </ul>
                        </div>

                    </div>
                </div>
            );
        } else
            return ""
    }

    handlePageChange(number) {
        this.setState({
            activePage: number,
            paramBody: {
                typeName: this.state.txtTicketTypeName,
                page: number,
                limit: this.state.drbLimit,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    handleDelete(itemId) {
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/ticketType/${itemId}`,{
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
            if(error.response){
                if (error.response.data === 'TICKET_TYPE_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Ticket type not found');
                }else{
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
        places: state.places
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