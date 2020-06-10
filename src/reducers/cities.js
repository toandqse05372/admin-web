import * as Types from '../constants/ParksActionType';

var initialState = [];

const cities = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_CITIES:
            return [...action.cities];
        default: return [...state];
    }
};


export default cities;