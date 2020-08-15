import * as Types from '../constants/PaymentMethosActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';

export const actFetchPaymentMethodsRequest = () => {
    return dispatch => {
        return callApi(`method`, 'GET', null).then(res => {
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
        return callApi('method', 'POST', paymentMethod).then(res => {
            if (res) {
                dispatch(actAddPaymentMethod(res.data));
                NotificationManager.success('Success message', 'Add Payment Method successful');
            }
            child.goBack();
        }).catch(function(error) {
            if(error){
                if(error.response.data === 'PAYMENT_METHOD_EXISTED'){
                    NotificationManager.error('Error  message', 'Payment Method has been existed');
                }
            }
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
        return callApi(`method/${paymentMethod.id}`, 'PUT', paymentMethod).then(res => {
            if (res) {
                dispatch(actUpdatePaymentMethod(res.data));
                NotificationManager.success('Success message', 'Update Payment Method successful');
            }
            child.goBack();
        }).catch(function(error) {
            if(error.response){
                if(error.response.data === 'PAYMENT_METHOD_EXISTED'){
                    NotificationManager.error('Error  message', 'Payment Method has been existed');
                }
            }
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
        return callApi(`method/${id}`, 'DELETE', null).then(res => {
            if (res) {
                dispatch(actDeletePaymentMethod(id));
            }
            NotificationManager.success('Success message', 'Delete Payment Method successful');
        }).catch(function(error) {
            if(error.response.data === 'PAYMENT_METHOD_NOT_FOUND'){
                NotificationManager.error('Error  message', 'Payment Method not found');
            }
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
        return callApi(`method/${id}`, 'GET', null).then(res => {
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