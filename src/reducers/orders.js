import * as Types from '../constants/OrdersActionType';

var initialState = [];

const orders = (state = initialState, action) => {
    var { order, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_ORDERS:
            return [...action.orders];
        case Types.ADD_ORDER:
            state.push(order);
            return [...state];
        case Types.UPDATE_ORDER:
            index = findIndex(state, order.id);
            state[index] = order;
            return [...state];
        case Types.DELETE_ORDER:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (orders, id) => {
    var result = -1;
    orders.forEach((order, index) => {
        if (order.id === id) {
            result = index;
        }
    });
    return result;
}

export default orders;