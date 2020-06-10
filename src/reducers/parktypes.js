import * as Types from '../constants/ParksActionType';

var initialState = [];

const parktypes = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_PARK_TYPES:
            return [...action.parktypes];
        default: return [...state];
    }
};


export default parktypes;