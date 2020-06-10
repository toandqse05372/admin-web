import * as Types from '../constants/UsersActionType';
import axios from 'axios';
import * as URL from '../constants/ConfigURL';
import callApi from '../utils/apiCaller';

export const actFetchUsersRequest = (paramBody) => {
    return (dispatch) => {
        axios.get(URL.API_URL + '/user/searchMul', {
            params: {
                firstName: paramBody.firstName,
                lastName: paramBody.lastName,
                mail: paramBody.mail,
                phoneNumber: paramBody.phoneNumber,
                role: paramBody.role,
                limit: paramBody.limit,
                page: paramBody.page
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

export const actAddUserRequest = (users, child) => {
    return (dispatch) => {
        return callApi('user/createUserCMS', 'POST', users).then(res => {
            dispatch(actAddUser(res.data));
            child.goBack();
        });
    }
}

export const actAddUser = (users) => {
    return {
        type: Types.ADD_USER,
        users
    }
}

export const actUpdateUserRequest = (user, child) => {
    return (dispatch) => {
        return callApi(`user/${user.id}`, 'PUT', user).then(res => {
            if (res) {
                dispatch(actUpdateUser(res.data));
            }
            child.goBack();
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

export const actFetchRolesRequest = () => {
    return dispatch => {
        return callApi(`user/roles`, 'GET', null).then(res => {
            dispatch(actFetchRoles(res.data))
        });
    }
}

export const actFetchRoles = (roles) => {
    return {
        type: Types.FETCH_ROLES,
        roles
    }
}

export const actFetchTokenRequest = (token) => {
    return (dispatch) => {
        return callApi('user/token', 'POST', token).then(res => {
            dispatch(actFetchToken(res.data));
        });
    }
}

export const actFetchToken = (token) => {
    return {
        type: Types.FETCH_TOKEN,
        token
    }
}