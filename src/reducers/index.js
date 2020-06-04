import { combineReducers } from 'redux';
import parks from './parks';
import users from './users';
import itemEditing from './itemEditing';

const appReducers = combineReducers({
    users,
    parks,
    itemEditing
});

export default appReducers;