import * as Types from '../constants/ParksActionType';
import axios from 'axios';
import * as URL from '../constants/ConfigURL';
import callApi from '../utils/apiCaller';

export const actFetchParksRequest = (paramBody) => {
    return (dispatch) => {
        axios.get(URL.API_URL + '/park/searchName', {
            params: {
                name: paramBody.name,
                page: paramBody.page,
                limit: paramBody.limit
            }
        })
            .then(res => {
                dispatch(actFetchParks(res.data.listResult));
            });
    }
}

export const actFetchParks = (parks) => {
    return {
        type: Types.FETCH_PARKS,
        parks
    }
}

export const actAddParkRequest = (parks, child) => {
    return (dispatch) => {
        return callApi('park', 'POST', parks).then(res => {
            dispatch(actAddPark(res.data));
            child.goBack();
        });
    }
}

export const actAddPark = (parks) => {
    return {
        type: Types.ADD_PARK,
        parks
    }
}

export const actUpdateParkRequest = (park, child) => {
    return (dispatch) => {
        return callApi(`park/${park.id}`, 'PUT', park).then(res => {
            if (res) {
                dispatch(actUpdatePark(res.data));
                child.goBack();
            }
        });
    }
}

export const actUpdatePark = (park) => {
    return {
        type: Types.UPDATE_PARK,
        park
    }
}

export const actDeleteParkRequest = (id) => {
    return (dispatch) => {
        return callApi(`park/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeletePark(id));
        });
    }
}

export const actDeletePark = (id) => {
    return {
        type: Types.DELETE_PARK,
        id
    }
}

export const actGetParkRequest = (id) => {
    return dispatch => {
        return callApi(`park/${id}`, 'GET', null).then(res => {
            dispatch(actGetPark(res.data))
        });
    }
}

export const actGetPark = (park) => {
    return {
        type: Types.EDIT_PARK,
        park
    }
}

export const actFetchParkTypesRequest = () => {
    return dispatch => {
        return callApi(`park/parktypes`, 'GET', null).then(res => {
            dispatch(actFetchParkTypes(res.data))
        });
    }
}

export const actFetchParkTypes = (parktypes) => {
    return {
        type: Types.FETCH_PARK_TYPES,
        parktypes
    }
}