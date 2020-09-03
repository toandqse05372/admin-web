import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import PlaceItem from './components/PlaceItem';
import PlaceList from './components/PlaceList';
import { actFetchPlacesRequest, actDeletePlaceRequest, actChangeStatusPlaceRequest } from '../../../actions/indexPlaces';
import { actFetchCategoriesRequest } from '../../../actions/indexCategories';
import { actFetchCitiesRequest } from '../../../actions/indexCities';
import callApi from '../../../utils/apiCaller';
import axios from 'axios'
import * as Config from '../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';

class PlacesCMS extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
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
        this.setState({
            activePage: 1
        })
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                name: (name === 'txtPlaceName') ? value : this.state.txtPlaceName,
                address: (name === "txtAddress") ? value : this.state.txtAddress,
                categoryId: (name === "drbcategory") ? value : this.state.drbcategory,
                cityId: (name === "drBCity") ? value : this.state.drBCity,
                page: this.state.activePage,
                limit: (name === "drbLimit") ? value : this.state.drbLimit,
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.setState({
            currentPage: 1
        })
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        this.props.showOverlay(LoadType.loading)
        var props = this.props
        axios.get(Config.API_URL + '/place/searchMul',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    name: paramBody.name,
                    address: paramBody.address,
                    categoryId: paramBody.categoryId,
                    cityId: paramBody.cityId,
                    limit: paramBody.limit,
                    page: paramBody.page
                }
            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems,
                loaded: true
            })
        }).catch(function (error) {
            props.showOverlay(LoadType.none)
            props.history.push("/error");
        });
    }

    render() {
        if (this.state.loaded) {
            if (localStorage.getItem('deleteResult')) {
                const excelResult = localStorage.getItem('deleteResult');
                if(excelResult === "OK"){
                    NotificationManager.success('Success message', 'Deltete city successful');
                    localStorage.removeItem('deleteResult');
                }else{
                    NotificationManager.error('Error message', "Something wrong");
                    localStorage.removeItem('deleteResult');
                }
            }
            const pageList = []
            const { txtPlaceName, txtAddress, drBCity, drbLimit, drbcategory, currentPage, totalItems } = this.state;
            var { cities, categories } = this.props;
            for (let i = 1; i <= this.state.totalPage; i++) {
                pageList.push(i)
            }
            const renderPageNumbers = pageList.map(number => {
                if (number == currentPage) {
                    return (
                        <li className="active" disabled >
                            <a value={number} >{number}</a>
                        </li>
                    );
                } else
                    return (
                        <li className='pointer'>
                            <a value={number} onClick={() => this.handlePageChange(number)}>{number}</a>
                        </li>
                    );
            });
            if(cities.length > 0 && categories.length > 0){
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
                        <PlaceList limit={drbLimit} totalItems={totalItems}>
                            {this.showPlaces(this.state.searchList)}
                        </PlaceList>
                        <div className="dataTables_paginate paging_bootstrap pagination">
                            <ul>
                                {renderPageNumbers}
                            </ul>
                        </div>
                    </div>
                );
            }else{
                return ""
            }
        } else
            return ""
    }

    handlePageChange(number) {
        this.setState({
            paramBody: {
                name: this.state.txtPlaceName,
                address: this.state.txtAddress,
                cityId: this.state.drBCity,
                categoryId: this.state.drbcategory,
                page: number,
                limit: this.state.drbLimit,
            }
        }, () => {
            this.receivedData(this.state.paramBody)
            this.state.currentPage = number
        })
    }

    handleDelete(itemId) {
        this.props.showOverlay(LoadType.deleting)
        const { searchList } = this.state;
        callApi(`place/${itemId}`, 'DELETE', null).then(res => {
            const items = searchList.filter(item => item.id !== itemId)
            this.props.showOverlay(LoadType.none)
            if (items.length == 0) {
                localStorage.setItem('deleteResult', 'OK');
                window.location.reload()
            } else {
                NotificationManager.success('Success message', 'Delete place successful');
                this.setState({
                    searchList: items
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'PLACE_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Place not found');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }

        });
    }

    handleChangeStatus(itemId) {
        this.props.showOverlay(LoadType.changing)
        const { searchList } = this.state;
        callApi(`changePlace/${itemId}`, 'PUT', null).then(res => {
            if (res) {
                const updateIndex = searchList.findIndex(item => item.id == itemId)
                let newList = searchList
                var up = searchList[updateIndex].status
                newList[updateIndex] = {
                    ...newList[updateIndex],
                    status: searchList[updateIndex].status === "ACTIVE" ? "DEACTIVATE" : "ACTIVE"
                }
                var up2 = newList[updateIndex].status
                this.setState({
                    searchList: newList
                })
                NotificationManager.success('Success message', 'Change place status successful');
                this.props.showOverlay(LoadType.none)
            }
        }).catch(function (error) {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'PLACE_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Place not found');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
        });
    }

    showPlaces(places) {
        var result = null;
        var { categories } = this.props;
        if (places.length > 0) {
            result = places.map((places, index) => {
                return <PlaceItem places={places} key={index}
                    index={index} onDeletePlace={this.handleDelete}
                    onChangeStatusPlace={this.handleChangeStatus}
                    limit={this.state.drbLimit}
                    currentPage={this.state.currentPage}
                    categories={categories}
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
        showOverlay: (status) => {
            dispatch(actUpdateOverlay(status))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesCMS);