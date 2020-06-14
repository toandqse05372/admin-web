import * as Types from '../constants/PaymentMethosActionType';
import callApi from '../utils/apiCaller';

export const actFetchPaymentMethodsRequest = () => {
    return dispatch => {
        return callApi(`paymentMethod`, 'GET', null).then(res => {
            dispatch(actFetchPaymentMethods(res.data))
        });
    }
}

export const actFetchPaymentMethods = (paymentMethods) => {
    return {
        type: Types.FETCH_PAYMENT_METHOD_TYPES,
        paymentMethods
    }
}

export const actAddPaymentMethodRequest = (paymentMethod, child) => {
    return (dispatch) => {
        return callApi('paymentMethod', 'POST', paymentMethod).then(res => {
            dispatch(actAddPaymentMethod(res.data));
            child.goBack();
        });
    }
}

export const actAddPaymentMethod = (paymentMethod) => {
    return {
        type: Types.ADD_PAYMENT_METHOD_TYPES,
        paymentMethod
    }
}

export const actUpdatePaymentMethodRequest = (paymentMethod, child) => {
    return (dispatch) => {
        return callApi(`paymentMethod/${paymentMethod.id}`, 'PUT', paymentMethod).then(res => {
            if (res) {
                dispatch(actUpdatePaymentMethod(res.data));
            }
            child.goBack();
        });
    }
}

export const actUpdatePaymentMethod = (paymentMethod) => {
    return {
        type: Types.UPDATE_PAYMENT_METHOD_TYPES,
        paymentMethod
    }
}

export const actDeletePaymentMethodRequest = (id) => {
    return (dispatch) => {
        return callApi(`paymentMethod/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeletePaymentMethod(id));
        });
    }
}

export const actDeletePaymentMethod = (id) => {
    return {
        type: Types.DELETE_PAYMENT_METHOD_TYPES,
        id
    }
}

export const actGetPaymentMethodRequest = (id) => {
    return dispatch => {
        return callApi(`paymentMethod/${id}`, 'GET', null).then(res => {
            dispatch(actGetPaymentMethod(res.data))
        });
    }
}

export const actGetPaymentMethod = (paymentMethod) => {
    return {
        type: Types.EDIT_PAYMENT_METHOD_TYPE,
        paymentMethod
    }
}