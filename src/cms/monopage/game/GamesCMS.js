import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import GameItem from './components/GameItem';
import GameList from './components/GameList';
import { actDeleteGameRequest, actChangeStatusGameRequest } from '../../../actions/indexGames';
import axios from 'axios';
import { actFetchPlacesRequest } from '../../../actions/indexPlaces'
import * as Config from '../../../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from '../../../actions/indexOverlay';
import * as LoadType from '../../../constants/LoadingType';
import callApi from '../../../utils/apiCaller';

class GamesCMS extends Component {
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

            txtGameName: '',
            txtPlaceName: '',
            drbCategory: '',

            paramBody: {
                gameName: '',
                placeName: '',
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
                gameName: (name === 'txtGameName') ? value : this.state.txtGameName,
                placeName: (name === 'txtPlaceName') ? value : this.state.txtPlaceName,
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
        axios.get(Config.API_URL + '/game/searchMul',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    gameName: paramBody.gameName,
                    placeName: paramBody.placeName,
                    limit: paramBody.limit,
                    page: paramBody.page
                }
            }
        ).then(res => {
            this.props.showOverlay(LoadType.none)
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems
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
                if(excelResult === "OK"){
                    NotificationManager.success('Success message', 'Deltete game successful');
                    localStorage.removeItem('deleteResult');
                }else{
                    NotificationManager.error('Error message', "Something wrong");
                    localStorage.removeItem('deleteResult');
                }
            }
            const pageList = []
            const { txtGameName, txtPlaceName,drbLimit, currentPage, totalItems } = this.state;
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
                        <h1>Game Manager</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th><Form.Label id="basic-addon1">Game Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Game Name"
                                            name="txtGameName"
                                            value={txtGameName}
                                            onChange={this.onChange}
                                        />
                                    </th>
                                    <th><Form.Label id="basic-addon1">Place Name </Form.Label>
                                        <FormControl
                                            type="text"
                                            placeholder="Place Name"
                                            name="txtPlaceName"
                                            value={txtPlaceName}
                                            onChange={this.onChange}
                                        />
                                    </th>
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
                    <Link to="/games/add" className="btn btn-success mb-5 ">
                        <i className="glyphicon glyphicon-plus"></i> Add New Game
                </Link>
                    <GameList totalItems={totalItems} >
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
            paramBody: {
                name: this.state.txtPlaceName,
                address: this.state.txtAddress,
                cityId: this.state.drBCity,
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
        axios.delete(Config.API_URL + `/game/${itemId}`,{
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            this.props.showOverlay(LoadType.none)
            NotificationManager.success('Success message', 'Delete game successful');
            const items = searchList.filter(item => item.id !== itemId)
            if (items.length == 0) {
                localStorage.setItem('deleteResult', 'OK');
                window.location.reload()
            } else {
                NotificationManager.success('Success message', 'Delete game successful');
                this.setState({
                    searchList: items
                })
            }
        }).catch(error => {
            this.props.showOverlay(LoadType.none)
            if(error.response){
                if(error.response.data === 'GAME_EXISTED'){
                    NotificationManager.error('Error  message', 'Game has been existed');
                }else{
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
        });
    }

    handleChangeStatus(itemId) {
        this.props.showOverlay(LoadType.changing)
        const { searchList } = this.state;
        callApi(`changeGame/${itemId}`, 'PUT', null).then(res => {
            if (res) {
                this.props.showOverlay(LoadType.none)
                NotificationManager.success('Success message', 'Change game status successful');
                const updateIndex = searchList.findIndex(item => item.id == itemId)
                let newList = searchList
                newList[updateIndex] = {
                    ...newList[updateIndex],
                    status: newList[updateIndex].status === "ACTIVE" ? "DEACTIVATE" : "ACTIVE"
                }
                this.setState({
                    searchList: newList
                })
            }
        }).catch(function (error) {
            this.props.showOverlay(LoadType.none)
            if (error.response) {
                if (error.response.data === 'GAME_NOT_FOUND') {
                    NotificationManager.error('Error  message', 'Game not found');
                } else {
                    NotificationManager.error('Error  message', 'Something wrong');
                }
            }
        });
    }

    showGames(games) {
        var result = null;
        var { onDeleteGame, onChangeStatusGame } = this.props;
        if (games.length > 0) {
            result = games.map((games, index) => {
                return <GameItem games={games} key={index} index={index} 
                onDeleteGame={this.handleDelete} 
                onChangeStatusGame={this.handleChangeStatus} 
                limit={this.state.drbLimit}
                currentPage = {this.state.currentPage}/>
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        // games: state.games,
        // places: state.places
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onDeleteGame: (id) => {
            dispatch(actDeleteGameRequest(id));
        },
        onChangeStatusGame: (id) => {
            dispatch(actChangeStatusGameRequest(id));
        },
        // fetchAllPlaces: () => {
        //     dispatch(actFetchPlacesRequest());
        // },
        showOverlay: (status) => {
            dispatch(actUpdateOverlay(status))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesCMS);