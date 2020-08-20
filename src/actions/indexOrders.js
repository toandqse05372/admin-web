import * as Types from '../constants/OrdersActionType';
import axios from 'axios';
import * as URL from '../constants/ConfigURL';
import callApi from '../utils/apiCaller';
import { actUpdateOverlay } from './indexOverlay';
import * as LoadType from '../constants/LoadingType';

export const actFetchOrdersRequest = (paramBody) => {
    return (dispatch) => {
        axios.get(URL.API_URL + '/order/searchName', {
            params: {
                name: paramBody.name,
                page: paramBody.page,
                limit: paramBody.limit
            }
        })
            .then(res => {
                dispatch(actFetchOrders(res.data.listResult));
            });
    }
}

export const actFetchOrders = (orders) => {
    return {
        type: Types.FETCH_ORDERS,
        orders
    }
}

export const actAddOrderRequest = (orders, child) => {
    return (dispatch) => {
        return callApi('order', 'POST', orders).then(res => {
            dispatch(actAddOrder(res.data));
            child.goBack();
        });
    }
}

export const actAddOrder = (orders) => {
    return {
        type: Types.ADD_ORDER,
        orders
    }
}

export const actUpdateOrderRequest = (order, child) => {
    return (dispatch) => {
        return callApi(`order/${order.id}`, 'PUT', order).then(res => {
            if (res) {
                dispatch(actUpdateOrder(res.data));
                child.goBack();
            }
        });
    }
}

export const actUpdateOrder = (order) => {
    return {
        type: Types.UPDATE_ORDER,
        order
    }
}

export const actDeleteOrderRequest = (id) => {
    return (dispatch) => {
        return callApi(`order/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeleteOrder(id));
        });
    }
}

export const actDeleteOrder = (id) => {
    return {
        type: Types.DELETE_ORDER,
        id
    }
}

export const actGetOrderRequest = (id) => {
    return dispatch => {
        dispatch(actUpdateOverlay(LoadType.loading));
        return callApi(`orderCMS/${id}`, 'GET', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none));
            dispatch(actGetOrder(res.data))
        }).catch(error => {
            dispatch(actUpdateOverlay(LoadType.none));
        });
    }
}

export const actGetOrder = (order) => {
    return {
        type: Types.EDIT_ORDER,
        order
    }
}