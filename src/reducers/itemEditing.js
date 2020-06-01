import * as Types from '../constants/ParksActionType';
var initialState = {};

const itemEditing = (state = initialState, action) => {
    switch(action.type){
        case Types.EDIT_PARK:
            return action.park;
        default :
            return state;
    }
}

export default itemEditing;