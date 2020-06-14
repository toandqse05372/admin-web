import * as PlacesTypes from '../constants/PlacesActionType';
import * as UsersTypes from '../constants/UsersActionType';
import * as GamesTypes from '../constants/GamesActionType';
import * as CitiesTypes from '../constants/CitiesActionType';
import * as PlaceTypesActionType from '../constants/PlaceTypesActionType';
import * as TicketTypes from '../constants/TicketTypesActionType';
import * as PaymentMethosActionTypes from '../constants/PaymentMethosActionType';
var initialState = {};

const itemEditing = (state = initialState, action) => {
    switch (action.type) {
        case PlacesTypes.EDIT_PLACE:
            return action.place;
        case UsersTypes.EDIT_USER:
            return action.user;
        case GamesTypes.EDIT_GAME:
            return action.game;
        case CitiesTypes.EDIT_CITY:
            return action.city
        case TicketTypes.EDIT_TICKET_TYPE:
            return action.ticketType
        case PlaceTypesActionType.EDIT_PLACE_TYPE:
            return action.placeType
        case PaymentMethosActionTypes.EDIT_PAYMENT_METHOD_TYPE:
            return action.paymentMethosActionType
        default:
            return state;
    }
}

export default itemEditing;