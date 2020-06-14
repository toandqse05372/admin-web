import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import PlaceTypeItem from './components/PlaceTypeItem';
import PlaceTypeList from './components/PlaceTypeList';
import { actDeletePlaceTypeRequest } from '../../../actions/indexPlaceTypes';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';

class PlaceTypesCMS extends Component {
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

            txtTypeName: '',

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
                // name: (name === "txtCityName") ? value : this.state.txtCityName,
                // page: this.state.activePage,
                // limit: (name === "drbLimit") ? value : this.state.drbLimit,
            }
        })

    }

    onSubmitSearch = (e) => {
        e.preventDefault();
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        axios.get(URL.API_URL + '/placeType',
            {
                headers: {
                    Authorization: "Token " + JSON.parse(localStorage.getItem('tokenLogin'))
                },
               
            }
        ).then(res => {
            //set state
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data,
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
            const { txtCityName, drbLimit, currentPage } = this.state;
            var { cities } = this.props;
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
                        <h1>Quản lý loại địa điểm</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Tên loại địa điểm </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Tên tỉnh / thành"
                                            name="txtCityName"
                                            value={txtCityName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th>
                                        <Form.Label>Hiển thị</Form.Label>
                                        <Form.Control as="select"
                                            name="drbLimit"
                                            value={drbLimit}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={10}>10 / trang</option>
                                            <option key={1} index={1} value={15}>15 / trang</option>
                                            <option key={2} index={2} value={20}>20 / trang</option>
                                        </Form.Control>
                                    </th>

                                </tr>
                                <tr>
                                    <td>
                                        <Button
                                            type="Submit"
                                            className="btn btn-inverse mb-5">
                                            Tìm kiếm
                                        </Button>
                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Form>
                    <Link to="/placeTypes/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Thêm loại địa điểm
                </Link>
                    <PlaceTypeList>
                        {this.showPlaceTypes(this.state.searchList)}
                    </PlaceTypeList>
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

    showPlaceTypes(placeTypes) {
        var result = null;
        var { onDeletePlaceType } = this.props;
        if (placeTypes.length > 0) {
            result = placeTypes.map((placeTypes, index) => {
                return <PlaceTypeItem placeTypes={placeTypes} key={index} index={index} onDeletePlaceType={onDeletePlaceType} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        placeTypes: state.placeTypes
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeletePlaceType: (id) => {
            dispatch(actDeletePlaceTypeRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceTypesCMS);