import { combineReducers } from 'redux';
import parks from './parks';
import itemEditing from './itemEditing';

const appReducers = combineReducers({
    parks,
    itemEditing
});

export default appReducers;