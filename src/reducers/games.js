import * as Types from '../constants/GamesActionType';

var initialState = [];

const games = (state = initialState, action) => {
    var { game, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_GAMES:
            return action.games;
        case Types.ADD_GAME:
            state.push(game);
            return [...state];
        case Types.UPDATE_GAME:
            index = findIndex(state, game.id);
            state[index] = game;
            return [...state];
        case Types.CHANGE_STATUS_GAME:
            index = findIndex(state, game.id);
            state[index] = game;
            return [...state];
        case Types.DELETE_GAME:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (games, id) => {
    var result = -1;
    games.forEach((game, index) => {
        if (game.id === id) {
            result = index;
        }
    });
    return result;
}

export default games;