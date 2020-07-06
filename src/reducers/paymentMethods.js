import * as Types from '../constants/PaymentMethosActionType';

var initialState = [];

const paymentMethods = (state = initialState, action) => {
    var { paymentMethod, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_PAYMENT_METHOD_TYPES:
            return [...action.paymentMethods];
        case Types.ADD_PAYMENT_METHOD_TYPES:
            state.push(paymentMethod);
            return [...state];
        case Types.UPDATE_PAYMENT_METHOD_TYPES:
            index = findIndex(state, paymentMethod.id);
            state[index] = paymentMethod;
            return [...state];
        case Types.DELETE_PAYMENT_METHOD_TYPES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (paymentMethods, id) => {
    var result = -1;
    paymentMethods.forEach((paymentMethod, index) => {
        if (paymentMethod.id === id) {
            result = index;
        }
    });
    return result;
}

export default paymentMethods;