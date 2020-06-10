import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import ParkItem from './components/ParkItem';
import ParkList from './components/ParkList';
import { actFetchParksRequest, actDeleteParkRequest, actFetchParkTypesRequest, actFetchCitiesRequest } from '../../../actions/indexParks';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';
import cities from '../../../reducers/cities';
import parktypes from '../../../reducers/parktypes';

class ParksCMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            activePage: 1,
            drbLimit: 10,
            searchList: [],
            totalItems: 0,
            totalPage: 1,
            currentPage: 1,

            txtParkName: '',
            drBCity: 0,
            txtMail: '',
            txtPhoneNumber: '',
            drbParkType: 0,
            txtAddress: '',

            paramBody: {
                name: '',
                address: '',
                cityId: '',
                parkTypeId: '',
                role: 0,
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.state.paramBody);
        this.props.fetchAllCities();
        this.props.fetchAllParkTypes();
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                name: value,
                page: 1,
                limit: 10,
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        axios.get(URL.API_URL + '/park/searchMUL',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    name: paramBody.name,
                    address: paramBody.address,
                    parkTypeId: paramBody.parkTypeId,
                    cityId: paramBody.cityId,
                    limit: paramBody.limit,
                    page: paramBody.page
                }
            }
        ).then(res => {
            //set state
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems,
                totalPage: res.data.totalPage
            })
        }).catch(function (error) {
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            const pageList = []
            const { txtParkName, txtAddress, drBCity, drbLimit, drbParkType, currentPage } = this.state;
            var { cities, parktypes } = this.props;
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
                    <Form onSubmit={this.onSubmitSearch} >
                        <h1>Park Management</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Park Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Park Name"
                                            name="txtParkName"
                                            value={txtParkName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th><Form.Label id="basic-addon1">Address </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Address"
                                            name="txtAddress"
                                            value={txtAddress}
                                            onChange={this.onChange}
                                        /></th>
                                    <th><Form.Label id="basic-addon1">City </Form.Label>
                                        <Form.Control as="select"
                                            name="drBCity"
                                            value={drBCity}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>--Select City--</option>
                                            {this.showCities(cities)}
                                        </Form.Control></th>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label id="basic-addon1">Park Type</Form.Label>
                                        <Form.Control as="select"
                                            name="drbParkType"
                                            value={drbParkType}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>--Select Park Type--</option>
                                            {this.showParkTypes(parktypes)}
                                        </Form.Control>
                                    </td>
                                    
                                    <td>
                                        <Form.Label>Show</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10</option>
                                            <option key={1} index={1} value={15}>15</option>
                                            <option key={2} index={2} value={20}>20</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Search
                                        </Button>
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/parks/add" className="btn btn-primary mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add Park
                </Link>
                    <ParkList>
                        {this.showParks(this.state.searchList)}
                    </ParkList>
                    <div className="dataTables_paginate paging_bootstrap pagination">
                        <ul>
                            {renderPageNumbers}
                        </ul>
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
                name: this.state.txtParkName,
                address: this.state.txtAddress,
                cityId: this.state.drBCity,
                parkTypeId: this.state.drbParkType,
                page: 1,
                limit: 10,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    showParks(parks) {
        var result = null;
        var { onDeletePark } = this.props;
        if (parks.length > 0) {
            result = parks.map((parks, index) => {
                return <ParkItem parks={parks} key={index} index={index} onDeletePark={onDeletePark} />
            });
        }
        return result;
    }

    showCities(cities) {
        var result = null;
        if (cities.length > 0) {
            result = cities.map((cities, index) => {
                return <option key={index} index={index} value={cities.id}>{cities.name}</option>
            });
        }
        return result;
    }

    showParkTypes(parktypes) {
        var result = null;
        if (parktypes.length > 0) {
            result = parktypes.map((parktypes, index) => {
                return <option key={index} index={index} value={parktypes.id}>{parktypes.parkTypeName}</option>
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        parks: state.parks,
        cities: state.cities,
        parktypes: state.parktypes,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllParks: (paramBody) => {
            dispatch(actFetchParksRequest(paramBody));
        },
        onDeletePark: (id) => {
            dispatch(actDeleteParkRequest(id));
        },
        fetchAllCities: () => {
            dispatch(actFetchCitiesRequest());
        },
        fetchAllParkTypes: () => {
            dispatch(actFetchParkTypesRequest());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParksCMS);