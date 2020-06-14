import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import PlaceItem from './components/PlaceItem';
import PlaceList from './components/PlaceList';
import { actFetchPlacesRequest, actDeletePlaceRequest, actFetchPlaceTypesRequest } from '../../../actions/indexPlaces';
import { actFetchCitiesRequest } from '../../../actions/indexCities';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';

class PlacesCMS extends Component {
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

            txtPlaceName: '',
            drBCity: 0,
            txtMail: '',
            txtPhoneNumber: '',
            drbPlaceType: 0,
            txtAddress: '',

            paramBody: {
                name: '',
                address: '',
                cityId: '',
                PlaceTypeId: '',
                role: 0,
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.state.paramBody);
        this.props.fetchAllCities();
        this.props.fetchAllPlaceTypes();
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
        axios.get(URL.API_URL + '/place/searchMUL',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    name: paramBody.name,
                    address: paramBody.address,
                    place: paramBody.placeTypeId,
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
            const { txtPlaceName, txtAddress, drBCity, drbLimit, drbPlaceType, currentPage } = this.state;
            var { cities, placeTypes } = this.props;
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
                        <h1>Quản lý địa điểm</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Tên địa điểm</Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Tên địa điểm"
                                            name="txtPlaceName"
                                            value={txtPlaceName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th><Form.Label id="basic-addon1">Địa chỉ </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Địa chỉ"
                                            name="txtAddress"
                                            value={txtAddress}
                                            onChange={this.onChange}
                                        /></th>
                                    <th><Form.Label id="basic-addon1">Tỉnh / Thành </Form.Label>
                                        <Form.Control as="select"
                                            name="drBCity"
                                            value={drBCity}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>-- Chọn Tỉnh / Thành --</option>
                                            {this.showCities(cities)}
                                        </Form.Control></th>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label id="basic-addon1">Loại</Form.Label>
                                        <Form.Control as="select"
                                            name="drbPlaceType"
                                            value={drbPlaceType}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>-- Chọn loại--</option>
                                            {this.showPlaceTypes(placeTypes)}
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Label>Hiển thị</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / trang</option>
                                            <option key={1} index={1} value={15}>15 / trang</option>
                                            <option key={2} index={2} value={20}>20 / trang</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Tìm kiếm
                                        </Button>
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/Places/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Thêm địa điểm
                </Link>
                    <PlaceList>
                        {this.showPlaces(this.state.searchList)}
                    </PlaceList>
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
                name: this.state.txtPlaceName,
                address: this.state.txtAddress,
                cityId: this.state.drBCity,
                PlaceTypeId: this.state.drbPlaceType,
                page: 1,
                limit: 10,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    showPlaces(Places) {
        var result = null;
        var { onDeletePlace } = this.props;
        if (Places.length > 0) {
            result = Places.map((Places, index) => {
                return <PlaceItem Places={Places} key={index}
                 index={index} onDeletePlace={onDeletePlace}
                  limit={this.state.drbLimit}
                  currentPage = {this.state.currentPage}
                  />
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

    showPlaceTypes(Placetypes) {
        var result = null;
        if (Placetypes.length > 0) {
            result = Placetypes.map((Placetypes, index) => {
                return <option key={index} index={index} value={Placetypes.id}>{Placetypes.PlaceTypeName}</option>
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        Places: state.Places,
        cities: state.cities,
        Placetypes: state.Placetypes,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllPlaces: (paramBody) => {
            dispatch(actFetchPlacesRequest(paramBody));
        },
        onDeletePlace: (id) => {
            dispatch(actDeletePlaceRequest(id));
        },
        fetchAllCities: () => {
            dispatch(actFetchCitiesRequest());
        },
        fetchAllPlaceTypes: () => {
            dispatch(actFetchPlaceTypesRequest());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesCMS);