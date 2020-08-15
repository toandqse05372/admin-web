import * as Types from '../constants/PlacesActionType';

var initialState = [];

const places = (state = initialState, action) => {
    var { place, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_PLACES:
            return action.places;
        case Types.ADD_PLACE:
            state.push(place);
            return [...state];
        case Types.UPDATE_PLACE:
            index = findIndex(state, place.id);
            state[index] = place;
            return [...state];
        case Types.CHANGE_STATUS_PLACE:
            index = findIndex(state, place.id);
            state[index] = place;
            return [...state];
        case Types.DELETE_PLACE:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (places, id) => {
    var result = -1;
    places.forEach((place, index) => {
        if (place.id === id) {
            result = index;
        }
    });
    return result;
}

export default places;