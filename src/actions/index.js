import * as Types from '../constants/ParksActionType';
import callApi from '../utils/apiCaller';

export const actFetchParksRequest = () => {
    return (dispatch) => {
        return callApi('parks', 'GET', null).then(res => {
            dispatch(actFetchParks(res.data));
        });
    }
}

export const actFetchParks = (parks) => {
    return {
        type: Types.FETCH_PARKS,
        parks
    }
}

export const actAddParkRequest = (parks) => {
    return (dispatch) => {
        return callApi('park', 'POST', parks).then(res => {
            dispatch(actAddPark(res.data));
        });
    }
}

export const actAddPark = (parks) => {
    return {
        type: Types.ADD_PARK,
        parks
    }
}

export const actUpdateParkRequest = (park) => {
    return (dispatch) => {
        return callApi(`park/${park.id}`, 'PUT', park).then(res => {
            if (res) {
                dispatch(actUpdatePark(res.data));
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
        type : Types.EDIT_PARK,
        park
    }
}