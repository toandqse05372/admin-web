import * as ParksTypes from '../constants/ParksActionType';
import * as UsersTypes from '../constants/UsersActionType';
var initialState = {};

const itemEditing = (state = initialState, action) => {
    switch(action.type){
        case ParksTypes.EDIT_PARK:
            return action.park;
        case UsersTypes.EDIT_USER:
            return action.user
        default :
            return state;
    }
}

export default itemEditing;