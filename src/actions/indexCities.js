import * as Types from '../constants/CitiesActionType';
import callApi from '../utils/apiCaller';

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
        return callApi('city', 'POST', city).then(res => {
            dispatch(actAddCity(res.data));
            child.goBack();
        });
    }
}

export const actAddCity = (city) => {
    return {
        type: Types.ADD_CITIES,
        city
    }
}

export const actUpdateCityRequest = (city, child) => {
    return (dispatch) => {
        return callApi(`city/${city.id}`, 'PUT', city).then(res => {
            if (res) {
                dispatch(actUpdateCity(res.data));
            }
            child.goBack();
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
            dispatch(actDeleteCity(id));
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
        return callApi(`city/${id}`, 'GET', null).then(res => {
            dispatch(actGetCity(res.data))
        });
    }
}

export const actGetCity = (game) => {
    return {
        type: Types.EDIT_CITIES,
        game
    }
}