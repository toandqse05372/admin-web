import * as Types from '../constants/TicketTypesActionType';

var initialState = [];

const ticketTypes = (state = initialState, action) => {
    var { ticketType, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_TICKET_TYPES:
            return [...action.ticketTypes];
        case Types.ADD_TICKET_TYPES:
            state.push(ticketType);
            return [...state];
        case Types.UPDATE_TICKET_TYPES:
            index = findIndex(state, ticketType.id);
            state[index] = ticketType;
            return [...state];
        case Types.DELETE_TICKET_TYPES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (ticketTypes, id) => {
    var result = -1;
    ticketTypes.forEach((ticketType, index) => {
        if (ticketType.id === id) {
            result = index;
        }
    });
    return result;
}

export default ticketTypes;