import * as Types from '../constants/CategoriesActionType';
import callApi from '../utils/apiCaller';
import { NotificationManager } from 'react-notifications';
import { actUpdateOverlay } from './indexOverlay';
import * as LoadType from '../constants/LoadingType';

export const actFetchCategoriesRequest = () => {
    return dispatch => {
        return callApi(`categories`, 'GET', null).then(res => {
            dispatch(actFetchCategories(res.data))
        });
    }
}

export const actFetchCategories = (categories) => {
    return {
        type: Types.FETCH_CATEGORIES,
        categories
    }
}

export const actAddCategoryRequest = (category, child) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.adding))
        return callApi('category', 'POST', category).then(res => {
            dispatch(actUpdateOverlay(LoadType.none))
            if (res) {
                dispatch(actAddCategory(res.data));
                NotificationManager.success('Success message', 'Add category successful');
            }
            child.goBack();
        }).catch(function(error) {
            dispatch(actUpdateOverlay(LoadType.none))
            if(error.response.data === 'CATEGORY_EXISTED'){
                NotificationManager.error('Error  message', 'Category has been existed');
            }
        });
    }
}

export const actAddCategory = (category) => {
    return {
        type: Types.ADD_CATEGORIES,
        category
    }
}

export const actUpdateCategoryRequest = (category, child, id) => {
    return (dispatch) => {
        dispatch(actUpdateOverlay(LoadType.updating))
        return callApi(`category/${id}`, 'PUT', category).then(res => {
            if (res) {
                dispatch(actUpdateOverlay(LoadType.none))
                dispatch(actUpdateCategory(res.data));
                NotificationManager.success('Success message', 'Update category successful');
            }
            child.goBack();
        }).catch(function(error) {
            dispatch(actUpdateOverlay(LoadType.none))
            if(error.response.data === 'CATEGORY_EXISTED'){
                NotificationManager.error('Error  message', 'Category has been existed');
            }
        });
    }
}

export const actUpdateCategory = (category) => {
    return {
        type: Types.UPDATE_CATEGORIES,
        category
    }
}

export const actDeleteCategoryRequest = (id) => {
    return (dispatch) => {
        return callApi(`category/${id}`, 'DELETE', null).then(res => {
            if (res) {
                dispatch(actDeleteCategory(id));
            }
            NotificationManager.success('Success message', 'Delete city successful');
        }).catch(function(error) {
            if(error.response.data === 'CATEGORY_NOT_FOUND'){
                NotificationManager.error('Error  message', 'Category not found');
            }
        });
    }
}

export const actDeleteCategory = (id) => {
    return {
        type: Types.DELETE_CATEGORIES,
        id
    }
}

export const actGetCategoryRequest = (id) => {
    return dispatch => {
        dispatch(actUpdateOverlay(LoadType.loading));
        return callApi(`category/${id}`, 'GET', null).then(res => {
            dispatch(actUpdateOverlay(LoadType.none));
            dispatch(actGetCategory(res.data))
        }).catch(error => {
            dispatch(actUpdateOverlay(LoadType.none));
        });
    }
}

export const actGetCategory = (category) => {
    return {
        type: Types.EDIT_CATEGORY,
        category
    }
}