import * as Types from '../constants/VisitorTypeActionType';
import callApi from '../utils/apiCaller';


export const actAddVisitorTypeRequest = (visitorType, child) => {
    return (dispatch) => {
        return callApi('visitorType', 'POST', visitorType).then(res => {
            dispatch(actAddVisitorType(res.data));
            child.goBack();
        });
    }
}

export const actAddVisitorType = (visitorType) => {
    return {
        type: Types.ADD_VISISTOR_TYPES,
        visitorType
    }
}

export const actUpdateVisitorTypeRequest = (visitorType, child) => {
    return (dispatch) => {
        return callApi(`visitorType/${visitorType.id}`, 'PUT', visitorType).then(res => {
            if (res) {
                dispatch(actUpdateVisitorType(res.data));
            }
            child.goBack();
        });
    }
}

export const actUpdateVisitorType = (visitorType) => {
    return {
        type: Types.UPDATE_VISISTOR_TYPES,
        visitorType
    }
}

export const actDeleteVisitorTypeRequest = (id) => {
    return (dispatch) => {
        return callApi(`visitorType/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeleteVisitorType(id));
        });
    }
}

export const actDeleteVisitorType = (id) => {
    return {
        type: Types.DELETE_VISISTOR_TYPES,
        id
    }
}

export const actGetVisitorTypeRequest = (id) => {
    return dispatch => {
        return callApi(`visitorType/${id}`, 'GET', null).then(res => {
            dispatch(actGetVisitorType(res.data))
        });
    }
}

export const actGetVisitorType = (visitorType) => {
    return {
        type: Types.EDIT_VISISTOR_TYPE,
        visitorType
    }
}