import * as Types from '../constants/UsersActionType';

var initialState = [];

const roles = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_ROLES:
            return [...action.roles];
        default: return [...state];
    }
};


export default roles;