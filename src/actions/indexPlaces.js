import * as Types from '../constants/PlacesActionType';
import axios from 'axios';
import * as URL from '../constants/ConfigURL';
import callApi from '../utils/apiCaller';

export const actFetchPlacesRequest = (paramBody) => {
    return (dispatch) => {
        axios.get(URL.API_URL + '/place/searchName', {
            params: {
                name: paramBody.name,
                page: paramBody.page,
                limit: paramBody.limit
            }
        })
            .then(res => {
                dispatch(actFetchPlaces(res.data.listResult));
            });
    }
}

export const actFetchPlaces = (places) => {
    return {
        type: Types.FETCH_PLACES,
        places
    }
}

export const actAddPlaceRequest = (places, child) => {
    return (dispatch) => {
        return callApi('place', 'POST', places).then(res => {
            dispatch(actAddPlace(res.data));
            child.goBack();
        });
    }
}

export const actAddPlace = (places) => {
    return {
        type: Types.ADD_PLACE,
        places
    }
}

export const actUpdatePlaceRequest = (place, child) => {
    return (dispatch) => {
        return callApi(`place/${place.id}`, 'PUT', place).then(res => {
            if (res) {
                dispatch(actUpdatePlace(res.data));
                child.goBack();
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

export const actDeletePlaceRequest = (id) => {
    return (dispatch) => {
        return callApi(`place/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeletePlace(id));
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

export const actFetchPlaceTypesRequest = () => {
    return dispatch => {
        return callApi(`place/placetypes`, 'GET', null).then(res => {
            dispatch(actFetchPlaceTypes(res.data))
        });
    }
}

export const actFetchPlaceTypes = (placetypes) => {
    return {
        type: Types.FETCH_PLACE_TYPES,
        placetypes
    }
}