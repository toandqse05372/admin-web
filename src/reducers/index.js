import { combineReducers } from 'redux';
import parks from './parks';
import users from './users';
import roles from './roles';
import cities from './cities';
import parktypes from './parktypes';
import itemEditing from './itemEditing';

const appReducers = combineReducers({
    users,
    parks,
    roles,
    parktypes,
    cities,
    itemEditing
});

export default appReducers;