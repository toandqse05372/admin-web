import * as Types from '../constants/CategoriesActionType';

var initialState = [];

const categories = (state = initialState, action) => {
    var { category, id } = action;
    var index = -1;
    switch (action.type) {
        case Types.FETCH_CATEGORIES:
            return (action.categories.length < 1) ? action.categories : [...action.categories];
        case Types.ADD_CATEGORIES:
            state.push(category);
            return [...state];
        case Types.UPDATE_CATEGORIES:
            index = findIndex(state, category.id);
            state[index] = category;
            return [...state];
        case Types.DELETE_CATEGORIES:
            index = findIndex(state, id);
            state.splice(index, 1);
            return [...state];
        default: return state;
    }
};

var findIndex = (categories, id) => {
    var result = -1;
    categories.forEach((categorie, index) => {
        if (categorie.id === id) {
            result = index;
        }
    });
    return result;
}


export default categories;