import * as Types from '../constants/PlacesActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from './indexOverlay';
import * as LoadType from '../constants/LoadingType';

export const actFetchPlacesRequest = () => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.loading))
        return callApi('places', 'GET', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none))
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
        dispatch(actUpdateOverlay(LoadType.adding))
        return callApi('place', 'POST', place).then(res => {
            if (res) {
                dispatch(actUpdateOverlay(LoadType.none));
                dispatch(actAddPlace(res.data));
                NotificationManager.success('Success message', 'Add place successful');
            }
            child.goBack();
        }).catch(function (error) {
            dispatch(actUpdateOverlay(LoadType.none));
            if (error.response.data === 'PLACE_EXISTED') {
                NotificationManager.error('Please change place name', 'Place has been existed');
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
        dispatch(actUpdateOverlay(LoadType.updating));
        return callApi(`place/${id}`, 'PUT', place).then(res => {
            if (res) {
                dispatch(actUpdateOverlay(LoadType.none));
                dispatch(actUpdatePlace(res.data));
                NotificationManager.success('Success message', 'Update place successful');
            }
            child.goBack();
        }).catch(function (error) {
            dispatch(actUpdateOverlay(LoadType.none));
            if (error.response.data === 'PLACE_EXISTED') {
                NotificationManager.error('Please change place name', 'Place has been existed');
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
        dispatch(actUpdateOverlay(LoadType.changing));
        return callApi(`changePlace/${id}`, 'PUT', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none));
            if (res) {
                dispatch(actChangeStatusPlace(res.data));
            }
        }).catch(function (error) {
            dispatch(actUpdateOverlay(LoadType.none));
            if(error.response){
                if (error.response.data === 'PLACE_EXISTED') {
                    NotificationManager.error('Please change place name', 'Place has been existed');
                }else{
                    NotificationManager.error('Error mesage', 'Something wrong');
                }
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
        dispatch(actUpdateOverlay(LoadType.loading));
        return callApi(`place/${id}`, 'GET', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none));
            dispatch(actGetPlace(res.data))
        }).catch(error => {
            dispatch(actUpdateOverlay(LoadType.none));
        });
    }
}

export const actGetPlace = (place) => {
    return {
        type: Types.EDIT_PLACE,
        place
    }
}