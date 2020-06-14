import * as Types from '../constants/GamesActionType';
import callApi from '../utils/apiCaller';

// export const actFetchGamesRequest = (paramBody) => {
//     return (dispatch) => {
//         axios.get(URL.API_URL + '/Game/searchMul', {
//             params: {
//                 firstName: paramBody.firstName,
//                 lastName: paramBody.lastName,
//                 mail: paramBody.mail,
//                 phoneNumber: paramBody.phoneNumber,
//                 role: paramBody.role,
//                 limit: paramBody.limit,
//                 page: paramBody.page
//             }
//         })
//             .then(res => {
//                 dispatch(actFetchGames(res.data));
//             });
//     }
// }

// export const actFetchGames = (Games) => {
//     return {
//         type: Types.FETCH_GameS,
//         Games
//     }
// }

export const actAddGameRequest = (games, child) => {
    return (dispatch) => {
        return callApi('game', 'POST', games).then(res => {
            dispatch(actAddGame(res.data));
            child.goBack();
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
            }
            child.goBack();
        });
    }
}

export const actUpdateGame = (game) => {
    return {
        type: Types.UPDATE_GAME,
        game
    }
}

export const actDeleteGameRequest = (id) => {
    return (dispatch) => {
        return callApi(`game/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeleteGame(id));
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