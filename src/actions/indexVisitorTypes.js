import * as Types from '../constants/VisitorTypeActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';

export const actAddVisitorTypeRequest = (visitorType, child) => {
    return (dispatch) => {
        return callApi('visitorType', 'POST', visitorType).then(res => {
            if (res) {
                dispatch(actAddVisitorType(res.data));
                NotificationManager.success('Success message', 'Add visitor type successful');
            }
            child.goBack();
        }).catch(function (error) {
            if (error.response.data === 'VISITOR_TYPE_EXISTED') {
                NotificationManager.error('Error  message', 'Visitor type has been existed');
            }
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
                NotificationManager.success('Success message', 'Update visitor type successful');
            }
            child.goBack();
        }).catch(function (error) {
            if (error.response.data === 'VISITOR_TYPE_EXISTED') {
                NotificationManager.error('Error  message', 'Visitor type has been existed');
            }
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
            if (res) {
                dispatch(actDeleteVisitorType(id));
            }
            NotificationManager.success('Success message', 'Delete visitor type successful');
        }).catch(function(error) {
            if(error.response.data === 'VISITOR_TYPE_NOT_FOUND'){
                NotificationManager.error('Error  message', 'Visitor type not found');
            }
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