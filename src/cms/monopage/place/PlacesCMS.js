import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import PlaceItem from './components/PlaceItem';
import PlaceList from './components/PlaceList';
import { actFetchPlacesRequest, actDeletePlaceRequest, actChangeStatusPlaceRequest } from '../../../actions/indexPlaces';
import { actFetchCategoriesRequest } from '../../../actions/indexCategories';
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
            drbCategory: 0,
            txtAddress: '',

            paramBody: {
                name: '',
                address: '',
                cityId: 0,
                categoryId: 0,
                role: 0,
                page: 1,
                limit: 10,
            }
        }
    }
    componentDidMount() {// Gọi trước khi component đc render lần đầu tiên
        this.receivedData(this.state.paramBody);
        this.props.fetchAllCities();
        this.props.fetchAllCategories();
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
        axios.get(URL.API_URL + '/place/searchMul',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
                params: {
                    name: paramBody.name,
                    address: paramBody.address,
                    categoryId: paramBody.categoryId,
                    cityId: paramBody.cityId,
                    limit: paramBody.limit,
                    page: paramBody.page,
                    lang: 'jp'
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
            const { txtPlaceName, txtAddress, drBCity, drbLimit, drbcategory, currentPage } = this.state;
            var { cities, categories } = this.props;
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
                        <h1>Place Manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Place Name</Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Place Name"
                                            name="txtPlaceName"
                                            value={txtPlaceName}
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
                                            <option key={0} index={0} value={0}>-- Choose City --</option>
                                            {this.showCities(cities)}
                                        </Form.Control></th>
                                </tr>
                                <tr>
                                    <td>
                                        <Form.Label id="basic-addon1">Category</Form.Label>
                                        <Form.Control as="select"
                                            name="drbcategory"
                                            value={drbcategory}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>-- Choose Category --</option>
                                            {this.showCategories(categories)}
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Label>Show</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / page</option>
                                            <option key={1} index={1} value={15}>15 / page</option>
                                            <option key={2} index={2} value={20}>20 / page</option>
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
                    <Link to="/places/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add New Place
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
                categoryId: this.state.drbcategory,
                page: 1,
                limit: 10,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    showPlaces(places) {
        var result = null;
        var { onDeletePlace, categories, onChangeStatusPlace } = this.props;
        if (places.length > 0) {
            result = places.map((places, index) => {
                return <PlaceItem places={places} key={index}
                 index={index} onDeletePlace={onDeletePlace}
                 onChangeStatusPlace = {onChangeStatusPlace}
                  limit={this.state.drbLimit}
                  currentPage = {this.state.currentPage}
                  categories = {categories}
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

    showCategories(categories) {
        var result = null;
        if (categories.length > 0) {
            result = categories.map((category, index) => {
                return <option key={index} index={index} value={category.id}>{category.categoryName}</option>
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        places: state.places,
        cities: state.cities,
        categories: state.categories,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        },
        onDeletePlace: (id) => {
            dispatch(actDeletePlaceRequest(id));
        },
        onChangeStatusPlace: (id) => {
            dispatch(actChangeStatusPlaceRequest(id));
        },
        fetchAllCities: () => {
            dispatch(actFetchCitiesRequest());
        },
        fetchAllCategories: () => {
            dispatch(actFetchCategoriesRequest());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesCMS);