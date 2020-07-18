import * as Types from '../constants/CitiesActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from './indexOverlay';
import * as LoadType from '../constants/LoadingType';

export const actFetchCitiesRequest = () => {
    return dispatch => {
        return callApi(`city`, 'GET', null).then(res => {
            dispatch(actFetchCities(res.data))
        });
    }
}

export const actFetchCities = (cities) => {
    return {
        type: Types.FETCH_CITIES,
        cities
    }
}

export const actAddCityRequest = (city, child) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.adding))
        return callApi('city', 'POST', city).then(res => {
            if (res) {
                dispatch(actUpdateOverlay(LoadType.none))
                dispatch(actAddCity(res.data));
                NotificationManager.success('Success message', 'Add city successful');
            }
            child.goBack();
        }).catch(function(error) {
            dispatch(actUpdateOverlay(LoadType.none))
            if(error.response.data === 'CITY_EXISTED'){
                NotificationManager.error('Error  message', 'City has been existed');
            }
        });
    }
}

export const actAddCity = (city) => {
    return {
        type: Types.ADD_CITIES,
        city,
    }
}

export const actUpdateCityRequest = (city, child, id) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.updating))
        return callApi(`city/${id}`, 'PUT', city).then(res => {
            if (res) {
                dispatch(actUpdateOverlay(LoadType.none))
                dispatch(actUpdateCity(res.data));
                NotificationManager.success('Success message', 'Update city successful');
            }
            child.goBack();
        }).catch(function(error) {
            dispatch(actUpdateOverlay(LoadType.none))
            if(error.response.data === 'CITY_EXISTED'){
                NotificationManager.error('Error  message', 'City has been existed');
            }
        });
    }
}

export const actUpdateCity = (city) => {
    return {
        type: Types.UPDATE_CITIES,
        city
    }
}

export const actDeleteCityRequest = (id) => {
    return (dispatch) => {
        return callApi(`city/${id}`, 'DELETE', null).then(res => {
            if (res) {
                dispatch(actDeleteCity(id));
            }
            NotificationManager.success('Success message', 'Delete city successful');
        }).catch(function(error) {
            if(error.response.data === 'CITY_NOT_FOUND'){
                NotificationManager.error('Error  message', 'City not found');
            }
        });
    }
}

export const actDeleteCity = (id) => {
    return {
        type: Types.DELETE_CITIES,
        id
    }
}

export const actGetCityRequest = (id) => {
    return dispatch => {
        dispatch(actUpdateOverlay(LoadType.loading));
        return callApi(`city/${id}`, 'GET', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none));
            dispatch(actGetCity(res.data))
        }).catch(error => {
            dispatch(actUpdateOverlay(LoadType.none));
        });
    }
}

export const actGetCity = (city) => {
    return {
        type: Types.EDIT_CITY,
        city
    }
}