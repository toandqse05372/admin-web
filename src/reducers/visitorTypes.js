import * as Types from '../constants/VisitorTypeActionType';

var initialState = [];

const visitorTypes = (state = initialState, action) => {
    var { visitorType, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.ADD_VISISTOR_TYPES:
            state.push(visitorType);
            return [...state];
        case Types.UPDATE_VISISTOR_TYPES:
            index = findIndex(state, visitorType.id);
            state[index] = visitorType;
            return [...state];
        case Types.DELETE_VISISTOR_TYPES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (visitorTypes, id) => {
    var result = -1;
    visitorTypes.forEach((visitorType, index) => {
        if (visitorType.id === id) {
            result = index;
        }
    });
    return result;
}

export default visitorTypes;