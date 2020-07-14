import { combineReducers } from 'redux';
import places from './places';
import users from './users';
import roles from './roles';
import cities from './cities';
import games from './games';
import paymentMethods from './paymentMethods';
import categories from './categories';
import itemEditing from './itemEditing';
import ticketTypes from './ticketTypes';
import orders from './orders';
import visitorTypes from './visitorTypes';
import overlay from './overlay';

const appReducers = combineReducers({
    users,
    places,
    roles,
    categories,
    cities,
    ticketTypes,
    games,
    orders,
    paymentMethods,
    visitorTypes,
    itemEditing,
    overlay
});

export default appReducers;