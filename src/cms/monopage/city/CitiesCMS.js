import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import GameItem from './components/CityItem';
import GameList from './components/CityList';
import { actDeleteGameRequest } from '../../../actions/indexGames';
import axios from 'axios';
import * as URL from '../../../constants/ConfigURL';

class CitiesCMS extends Component {
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

            txtGameName: '',
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
        axios.get(URL.API_URL + '/game/searchMul',
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
                        <h1>Quản lý trò chơi</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Tên trò chơi </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Park Name"
                                            name="txtParkName"
                                            value={txtParkName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th><Form.Label id="basic-addon1">Công viên </Form.Label>
                                        <Form.Control as="select"
                                            name="drBCity"
                                            value={drBCity}
                                            onChange={this.onChange}>
                                            <option key={0} index={0} value={0}>-- Chọn Công viên --</option>
                                        </Form.Control></th>
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
                    <Link to="/games/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Thêm trò chơi
                </Link>
                    <GameList>
                        {this.showGames(this.state.searchList)}
                    </GameList>
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

    showGames(games) {
        var result = null;
        var { onDeleteGame } = this.props;
        if (games.length > 0) {
            result = games.map((games, index) => {
                return <GameItem games={games} key={index} index={index} onDeleteGame={onDeleteGame} />
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        games: state.games
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteGame: (id) => {
            dispatch(actDeleteGameRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitiesCMS);