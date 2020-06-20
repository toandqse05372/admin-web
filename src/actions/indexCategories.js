import * as Types from '../constants/CategoriesActionType';
import callApi from '../utils/apiCaller';

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
        return callApi('category', 'POST', category).then(res => {
            dispatch(actAddCategory(res.data));
            child.goBack();
        });
    }
}

export const actAddCategory = (category) => {
    return {
        type: Types.ADD_CATEGORIES,
        category
    }
}

export const actUpdateCategoryRequest = (category, child) => {
    return (dispatch) => {
        return callApi(`category/${category.id}`, 'PUT', category).then(res => {
            if (res) {
                dispatch(actUpdateCategory(res.data));
            }
            child.goBack();
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
            dispatch(actDeleteCategory(id));
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
        return callApi(`category/${id}`, 'GET', null).then(res => {
            dispatch(actGetCategory(res.data))
        });
    }
}

export const actGetCategory = (category) => {
    return {
        type: Types.EDIT_CATEGORY,
        category
    }
}