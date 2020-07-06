import * as Types from '../constants/GamesActionType';
import callApi from '../utils/apiCaller';
import axios from 'axios';
import * as Config from '../constants/ConfigURL';
import { NotificationManager } from 'react-notifications';

export const actFetchGamesRequest = (placeId) => {
    return (dispatch) => {
        axios.get(Config.API_URL + '/game/listOption', {
            params: {
                placeId: placeId
            }
        })
            .then(res => {
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
        return callApi('game', 'POST', games).then(res => {
            if (res) {
                dispatch(actAddGame(res.data));
                NotificationManager.success('Success message', 'Add game successful');
            }
            child.goBack();
        }).catch(function(error) {
            if(error.response.data === 'GAME_EXISTED'){
                NotificationManager.error('Error  message', 'Game has been existed');
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
        return callApi(`game/${game.id}`, 'PUT', game).then(res => {
            if (res) {
                dispatch(actUpdateGame(res.data));
                NotificationManager.success('Success message', 'Update game successful');
            }
            child.goBack();
        }).catch(function(error) {
            if(error.response.data === 'GAME_EXISTED'){
                NotificationManager.error('Error  message', 'Game has been existed');
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
        return callApi(`game/${id}`, 'GET', null).then(res => {
            dispatch(actGetGame(res.data))
        });
    }
}

export const actGetGame = (game) => {
    return {
        type: Types.EDIT_GAME,
        game
    }
}

// export const actFetchRolesRequest = () => {
//     return dispatch => {
//         return callApi(`Game/roles`, 'GET', null).then(res => {
//             dispatch(actFetchRoles(res.data))
//         });
//     }
// }

// export const actFetchRoles = (roles) => {
//     return {
//         type: Types.FETCH_ROLES,
//         roles
//     }
// }

// export const actFetchTokenRequest = (token) => {
//     return (dispatch) => {
//         return callApi('Game/token', 'POST', token).then(res => {
//             dispatch(actFetchToken(res.data));
//         });
//     }
// }

// export const actFetchToken = (token) => {
//     return {
//         type: Types.FETCH_TOKEN,
//         token
//     }
// }