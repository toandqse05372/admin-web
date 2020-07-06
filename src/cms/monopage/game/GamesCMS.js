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

class GamesCMS extends Component {
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
        this.receivedData(this.state.paramBody);
    }

    receivedData(paramBody) {
        axios.get(Config.API_URL + '/game/searchMul',
            {
                headers: {
                    Authorization: Config.Token
                },
                params: {
                    gameName: paramBody.name,
                    placeName: paramBody.address,
                    limit: paramBody.limit,
                    page: paramBody.page
                }
            }
        ).then(res => {
            //set state
            this.setState({
                totalPage: res.data.totalPage,
                searchList: res.data.listResult,
                totalItems: res.data.totalItems
            })
        }).catch(function (error) {
            console.log(error.response);
        });
        this.state.loaded = true
    }

    render() {
        if (this.state.loaded) {
            const pageList = []
            const { txtGameName, txtPlaceName,drbLimit, currentPage } = this.state;
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
        const { searchList } = this.state;
        axios.delete(Config.API_URL + `/game/${itemId}`,{
            headers: {
                Authorization: Config.Token
            }
        }).then(res => {
            NotificationManager.success('Success message', 'Delete game successful');
            const items = searchList.filter(item => item.id !== itemId)
            this.setState({
                searchList: items
            })
        }).catch(error => {
            if(error.response){
                if(error.response.data === 'GAME_EXISTED'){
                    NotificationManager.error('Error  message', 'Game has been existed');
                }else{
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
                onChangeStatusGame={onChangeStatusGame} 
                limit={this.state.drbLimit}
                currentPage = {this.state.currentPage}/>
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        games: state.games,
        places: state.places
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
        fetchAllPlaces: () => {
            dispatch(actFetchPlacesRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesCMS);