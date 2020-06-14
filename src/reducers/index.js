import { combineReducers } from 'redux';
import places from './places';
import users from './users';
import roles from './roles';
import cities from './cities';
import games from './games';
import paymentMethods from './paymentMethods';
import placeTypes from './placeTypes';
import itemEditing from './itemEditing';
import ticketTypes from './ticketTypes';

const appReducers = combineReducers({
    users,
    places,
    roles,
    placeTypes,
    cities,
    ticketTypes,
    games,
    paymentMethods,
    itemEditing
});

export default appReducers;