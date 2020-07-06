import * as Types from '../constants/TicketTypesActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';

export const actFetchTicketTypesRequest = () => {
    return dispatch => {
        return callApi(`ticketType`, 'GET', null).then(res => {
            dispatch(actFetchTicketTypes(res.data))
        });
    }
}

export const actFetchTicketTypes = (ticketTypes) => {
    return {
        type: Types.FETCH_TICKET_TYPES,
        ticketTypes
    }
}

export const actAddTicketTypeRequest = (ticketType, child) => {
    return (dispatch) => {
        return callApi('ticketType', 'POST', ticketType).then(res => {
            if (res) {
                dispatch(actAddTicketType(res.data));
                NotificationManager.success('Success message', 'Add ticket type successful');
            }
            child.goBack();
        }).catch(function (error) {
            if (error.response.data === 'TICKET_TYPE_EXISTED') {
                NotificationManager.error('Error  message', 'Ticket type has been existed');
            }
        });
    }
}

export const actAddTicketType = (ticketType) => {
    return {
        type: Types.ADD_TICKET_TYPES,
        ticketType
    }
}

export const actUpdateTicketTypeRequest = (ticketType, child) => {
    return (dispatch) => {
        return callApi(`ticketType/${ticketType.id}`, 'PUT', ticketType).then(res => {
            if (res) {
                dispatch(actUpdateTicketType(res.data));
                NotificationManager.success('Success message', 'Update ticket type successful');
            }
            child.goBack();
        }).catch(function (error) {
            if (error.response.data === 'TICKET_TYPE_EXISTED') {
                NotificationManager.error('Error  message', 'Ticket type has been existed');
            }
        });
    }
}

export const actUpdateTicketType = (ticketType) => {
    return {
        type: Types.UPDATE_TICKET_TYPES,
        ticketType
    }
}

export const actDeleteTicketTypeRequest = (id) => {
    return (dispatch) => {
        return callApi(`ticketType/${id}`, 'DELETE', null).then(res => {
            if (res) {
                dispatch(actDeleteTicketType(id));
            }
            NotificationManager.success('Success message', 'Delete Ticket type successful');
        }).catch(function(error) {
            if(error.response.data === 'TICKET_TYPE_NOT_FOUND'){
                NotificationManager.error('Error  message', 'Ticket type not found');
            }
        });
    }
}

export const actDeleteTicketType = (id) => {
    return {
        type: Types.DELETE_TICKET_TYPES,
        id
    }
}

export const actGetTicketTypeRequest = (id) => {
    return dispatch => {
        return callApi(`ticketType/${id}`, 'GET', null).then(res => {
            dispatch(actGetTicketType(res.data))
        });
    }
}

export const actGetTicketType = (ticketType) => {
    return {
        type: Types.EDIT_TICKET_TYPE,
        ticketType
    }
}