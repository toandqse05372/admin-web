import * as Types from '../constants/PaymentMethosActionType';

var initialState = [];

const paymentMehods = (state = initialState, action) => {
    var { paymentMehod, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_PAYMENT_METHOD_TYPES:
            return [...action.paymentMehods];
        case Types.ADD_PAYMENT_METHOD_TYPES:
            state.push(paymentMehod);
            return [...state];
        case Types.UPDATE_PAYMENT_METHOD_TYPES:
            index = findIndex(state, paymentMehod.id);
            state[index] = paymentMehod;
            return [...state];
        case Types.DELETE_PAYMENT_METHOD_TYPES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (paymentMehods, id) => {
    var result = -1;
    paymentMehods.forEach((paymentMehod, index) => {
        if (paymentMehod.id === id) {
            result = index;
        }
    });
    return result;
}

export default paymentMehods;