import * as Types from '../constants/PlacesActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';

export const actFetchPlacesRequest = () => {
    return (dispatch) => {
        return callApi('places', 'GET', null).then(res => {
            dispatch(actFetchPlaces(res.data));
        });
    }
}

export const actFetchPlaces = (places) => {
    return {
        type: Types.FETCH_PLACES,
        places
    }
}

export const actAddPlaceRequest = (place, child) => {
    return (dispatch) => {
        return callApi('place', 'POST', place).then(res => {
            if (res) {
                dispatch(actAddPlace(res.data));
                NotificationManager.success('Success message', 'Add place successful');
            }
            child.goBack();
        }).catch(function (error) {
            if (error.response.data === 'PLACE_EXISTED') {
                NotificationManager.error('Error  message', 'Place has been existed');
            }
        });
    }
}

export const actAddPlace = (places) => {
    return {
        type: Types.ADD_PLACE,
        places
    }
}

export const actUpdatePlaceRequest = (place, child, id) => {
    return (dispatch) => {
        return callApi(`place/${id}`, 'PUT', place).then(res => {
            if (res) {
                dispatch(actUpdatePlace(res.data));
                NotificationManager.success('Success message', 'Update place successful');
            }
            child.goBack();
        }).catch(function (error) {
            if (error.response.data === 'PLACE_EXISTED') {
                NotificationManager.error('Error  message', 'Place has been existed');
            }
        });
    }
}

export const actUpdatePlace = (place) => {
    return {
        type: Types.UPDATE_PLACE,
        place
    }
}

export const actChangeStatusPlaceRequest = (id) => {
    return (dispatch) => {
        return callApi(`changePlace/${id}`, 'PUT', null).then(res => {
            if (res) {
                dispatch(actChangeStatusPlace(res.data));
            }
        });
    }
}

export const actChangeStatusPlace = (place) => {
    return {
        type: Types.CHANGE_STATUS_PLACE,
        place
    }
}

export const actDeletePlaceRequest = (id) => {
    return (dispatch) => {
        return callApi(`place/${id}`, 'DELETE', null).then(res => {
            if (res) {
                dispatch(actDeletePlace(id));
            }
            NotificationManager.success('Success message', 'Delete place successful');
        }).catch(function(error) {
            debugger
            if(error.response.data === 'PLACE_NOT_FOUND'){
                NotificationManager.error('Error  message', 'Place not found');
            }
        });
    }
}

export const actDeletePlace = (id) => {
    return {
        type: Types.DELETE_PLACE,
        id
    }
}

export const actGetPlaceRequest = (id) => {
    return dispatch => {
        return callApi(`place/${id}`, 'GET', null).then(res => {
            dispatch(actGetPlace(res.data))
        });
    }
}

export const actGetPlace = (place) => {
    return {
        type: Types.EDIT_PLACE,
        place
    }
}