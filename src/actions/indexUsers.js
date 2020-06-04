import * as Types from '../constants/UsersActionType';
import axios from 'axios';
import * as URL from '../constants/ConfigURL';
import callApi from '../utils/apiCaller';

export const actFetchUsersRequest = (paramBody) => {
    return (dispatch) => {
        axios.get(URL.API_URL + '/user/searchMul', {
            params: {
                firstName: paramBody.firstName,
                mail: paramBody.mail
            }
        })
            .then(res => {
                dispatch(actFetchUsers(res.data));
            });
    }
}

export const actFetchUsers = (users) => {
    return {
        type: Types.FETCH_USERS,
        users
    }
}

export const actAddUserRequest = (users) => {
    return (dispatch) => {
        return callApi('user', 'POST', users).then(res => {
            dispatch(actAddUser(res.data));
        });
    }
}

export const actAddUser = (users) => {
    return {
        type: Types.ADD_USER,
        users
    }
}

export const actUpdateUserRequest = (user) => {
    return (dispatch) => {
        return callApi(`user/${user.id}`, 'PUT', user).then(res => {
            if (res) {
                dispatch(actUpdateUser(res.data));
            }
        });
    }
}

export const actUpdateUser = (user) => {
    return {
        type: Types.UPDATE_USER,
        user
    }
}

export const actDeleteUserRequest = (id) => {
    return (dispatch) => {
        return callApi(`user/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeleteUser(id));
        });
    }
}

export const actDeleteUser = (id) => {
    return {
        type: Types.DELETE_USER,
        id
    }
}

export const actGetUserRequest = (id) => {
    return dispatch => {
        return callApi(`user/${id}`, 'GET', null).then(res => {
            dispatch(actGetUser(res.data))
        });
    }
}

export const actGetUser = (user) => {
    return {
        type: Types.EDIT_USER,
        user
    }
}