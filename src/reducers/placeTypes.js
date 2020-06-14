import * as Types from '../constants/PlaceTypesActionType';

var initialState = [];

const placeTypes = (state = initialState, action) => {
    var { placeType, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_PLACE_TYPES:
            return [...action.placeTypes];
        case Types.ADD_PLACE_TYPES:
            state.push(placeType);
            return [...state];
        case Types.UPDATE_PLACE_TYPES:
            index = findIndex(state, placeType.id);
            state[index] = placeType;
            return [...state];
        case Types.DELETE_PLACE_TYPES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (placeTypes, id) => {
    var result = -1;
    placeTypes.forEach((placeType, index) => {
        if (placeType.id === id) {
            result = index;
        }
    });
    return result;
}


export default placeTypes;