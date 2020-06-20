import * as Types from '../constants/CitiesActionType';

var initialState = [];

const cities = (state = initialState, action) => {
    var { city, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_CITIES:
            return (action.cities.length < 1) ? action.cities : [...action.cities];
        case Types.ADD_CITIES:
            state.push(city);
            return [...state];
        case Types.UPDATE_CITIES:
            index = findIndex(state, city.id);
            state[index] = city;
            return [...state];
        case Types.DELETE_CITIES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (cities, id) => {
    var result = -1;
    cities.forEach((city, index) => {
        if (city.id === id) {
            result = index;
        }
    });
    return result;
}

export default cities;