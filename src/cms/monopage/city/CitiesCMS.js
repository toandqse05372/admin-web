import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import CityItem from './components/CityItem';
import CityList from './components/CityList';
import { actDeleteCityRequest } from '../../../actions/indexCities';
import axios from 'axios';
import * as Config from '../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';

class CitiesCMS extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            loaded: false,
            activePage: 1,
            drbLimit: 10,
            searchList: [],
            totalItems: 0,
            totalPage: 1,
            currentPage: 1,

            txtCityName: '',

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
        this.receivedData(this.state.paramBody);
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
            paramBody: {
                name: (name === "txtCityName") ? value : this.state.txtCityName,
                page: this.state.activePage,
                limit: (name === "drbLimit") ? value : this.state.drbLimit,
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        this.props.showOverlay(LoadType.loading)
        axios.get(Config.API_URL + '/city/searchByName',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    name: paramBody.name,
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
                totalPage: res.data.totalPage
            })
        }).catch(function (error) {
            this.props.showOverlay(LoadType.none)
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            if (localStorage.getItem('deleteResult')) {
                const excelResult = localStorage.getItem('deleteResult');
                if (excelResult === "OK") {
                    NotificationManager.success('Success message', 'Deltete city successful');
                    localStorage.removeItem('deleteResult');
                } else {
                    NotificationManager.error('Error message', "Something wrong");
                    localStorage.removeItem('deleteResult');
                }
            }
            const pageList = []
            const { txtCityName, drbLimit, currentPage, totalItems } = this.state;
            var { cities } = this.props;
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
            return (
                <div className="container span14">
                    <Form onSubmit={this.onSubmitSearch} >
                        <h1>City Manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">City Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="City Name"
                                            name="txtCityName"
                                            value={txtCityName}
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
                    <Link to="/cities/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add New City
                </Link>
                    <CityList totalItems={totalItems}>
                        {this.showCities(this.state.searchList)}
                    </CityList>
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
                name: this.state.txtCityName,
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
        axios.delete(Config.API_URL + `/city/${itemId}`, {
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            this.props.showOverlay(LoadType.none)
            const items = searchList.filter(item => item.id !== itemId)
            if (items.length == 0) {
                localStorage.setItem('deleteResult', 'OK');
                window.location.reload()
            } else {
                NotificationManager.success('Success message', 'Delete city successful');
                this.setState({
                    searchList: items
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'CITY_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'City not found');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
        });
    }

    showCities(cities) {
        var result = null;
        var { onDeleteCity } = this.props;
        if (cities.length > 0) {
            result = cities.map((city, index) => {
                return <CityItem city={city} key={index} index={index} onDeleteCity={this.handleDelete}
                    limit={this.state.drbLimit} currentPage={this.state.currentPage} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        cities: state.cities
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteCity: (id) => {
            dispatch(actDeleteCityRequest(id));
        },
        showOverlay: (status) => {
            dispatch(actUpdateOverlay(status))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesCMS);