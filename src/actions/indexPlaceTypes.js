import * as Types from '../constants/PlaceTypesActionType';
import callApi from '../utils/apiCaller';

export const actFetchPlaceTypesRequest = () => {
    return dispatch => {
        return callApi(`placeType`, 'GET', null).then(res => {
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

export const actAddPlaceTypeRequest = (placeType, child) => {
    return (dispatch) => {
        return callApi('placeType', 'POST', placeType).then(res => {
            dispatch(actAddPlaceType(res.data));
            child.goBack();
        });
    }
}

export const actAddPlaceType = (placeType) => {
    return {
        type: Types.ADD_PLACE_TYPES,
        placeType
    }
}

export const actUpdatePlaceTypeRequest = (placeType, child) => {
    return (dispatch) => {
        return callApi(`placeType/${placeType.id}`, 'PUT', placeType).then(res => {
            if (res) {
                dispatch(actUpdatePlaceType(res.data));
            }
            child.goBack();
        });
    }
}

export const actUpdatePlaceType = (placeType) => {
    return {
        type: Types.UPDATE_PLACE_TYPES,
        placeType
    }
}

export const actDeletePlaceTypeRequest = (id) => {
    return (dispatch) => {
        return callApi(`placeType/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeletePlaceType(id));
        });
    }
}

export const actDeletePlaceType = (id) => {
    return {
        type: Types.DELETE_PLACE_TYPES,
        id
    }
}

export const actGetPlaceTypeRequest = (id) => {
    return dispatch => {
        return callApi(`placeType/${id}`, 'GET', null).then(res => {
            dispatch(actGetPlaceType(res.data))
        });
    }
}

export const actGetPlaceType = (placeType) => {
    return {
        type: Types.EDIT_PLACE_TYPE,
        placeType
    }
}