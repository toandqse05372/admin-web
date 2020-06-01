import * as Types from '../constants/ParksActionType';

var initialState = [];

const parks = (state = initialState, action) => {
    console.group(action);
    var { park, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_PARKS:
            return [...action.parks];
        case Types.ADD_PARK:
            state.push(parks);
            return [...state];
        case Types.UPDATE_PARK:
            index = findIndex(state, park.id);
            state[index] = park;
            return [...state];
        case Types.DELETE_PARK:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return [...state];
    }
};

var findIndex = (parks, id) => {
    var result = -1;
    parks.forEach((park, index) => {
        if (park.id === id) {
            result = index;
        }
    });
    return result;
}

export default parks;