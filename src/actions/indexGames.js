import * as Types from '../constants/GamesActionType';
import callApi from '../utils/apiCaller';
import axios from 'axios';
import * as Config from '../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from './indexOverlay';
import * as LoadType from '../constants/LoadingType';

export const actFetchGamesRequest = (placeId) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.loading))
        axios.get(Config.API_URL + '/game/listOption', {
            params: {
                placeId: placeId
            }
        })
            .then(res => {
                dispatch(actUpdateOverlay(LoadType.none))
                dispatch(actFetchGames(res.data));
            });
    }
}

export const actFetchGames = (games) => {
    return {
        type: Types.FETCH_GAMES,
        games
    }
}

export const actAddGameRequest = (games, child) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.adding))
        return callApi('game', 'POST', games).then(res => {
            dispatch(actUpdateOverlay(LoadType.none))
            if (res) {
                dispatch(actAddGame(res.data));
                NotificationManager.success('Success message', 'Add game successful');
            }
            child.goBack();
        }).catch(function(error) {
            dispatch(actUpdateOverlay(LoadType.none))
            if(error.response.data === 'GAME_EXISTED'){
                NotificationManager.error('Error  message', 'Game has been existed');
            }if(error.response.data === 'NOT_CHOOSE_DATE'){
                NotificationManager.error('Error  message', 'Not choose place');
            }
        });
    }
}

export const actAddGame = (game) => {
    return {
        type: Types.ADD_GAME,
        game
    }
}

export const actUpdateGameRequest = (game, child) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.updating))
        return callApi(`game/${game.id}`, 'PUT', game).then(res => {
            dispatch(actUpdateOverlay(LoadType.none))
            if (res) {
                dispatch(actUpdateGame(res.data));
                NotificationManager.success('Success message', 'Update game successful');
            }
            child.goBack();
        }).catch(function(error) {
            dispatch(actUpdateOverlay(LoadType.none))
            if(error.response.data === 'GAME_EXISTED'){
                NotificationManager.error('Error  message', 'Game has been existed');
            }if(error.response.data === 'NOT_CHOOSE_DATE'){
                NotificationManager.error('Error  message', 'Not choose place');
            }
        });
    }
}

export const actUpdateGame = (game) => {
    return {
        type: Types.UPDATE_GAME,
        game
    }
}

export const actChangeStatusGameRequest = (id) => {
    return (dispatch) => {
        return callApi(`changeGame/${id}`, 'PUT', null).then(res => {
            if (res) {
                dispatch(actChangeStatusGame(res.data));
            }
        });
    }
}

export const actChangeStatusGame = (game) => {
    return {
        type: Types.CHANGE_STATUS_GAME,
        game
    }
}

export const actDeleteGameRequest = (id) => {
    return (dispatch) => {
        return callApi(`game/${id}`, 'DELETE', null).then(res => {
            if (res) {
                dispatch(actDeleteGame(id));
            }
            NotificationManager.success('Success message', 'Delete game successful');
        }).catch(function(error) {
            if(error.response.data === 'GAME_NOT_FOUND'){
                NotificationManager.error('Error  message', 'Game not found');
            }
        });
    }
}

export const actDeleteGame = (id) => {
    return {
        type: Types.DELETE_GAME,
        id
    }
}

export const actGetGameRequest = (id) => {
    return dispatch => {
        dispatch(actUpdateOverlay(LoadType.loading));
        return callApi(`game/${id}`, 'GET', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none));
            dispatch(actGetGame(res.data))
        }).catch(error => {
            dispatch(actUpdateOverlay(LoadType.none));
        });
    }
}

export const actGetGame = (game) => {
    return {
        type: Types.EDIT_GAME,
        game
    }
}