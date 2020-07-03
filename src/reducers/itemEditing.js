import * as PlacesTypes from '../constants/PlacesActionType';
import * as UsersTypes from '../constants/UsersActionType';
import * as GamesTypes from '../constants/GamesActionType';
import * as CitiesTypes from '../constants/CitiesActionType';
import * as CategoriesType from '../constants/CategoriesActionType';
import * as TicketTypes from '../constants/TicketTypesActionType';
import * as OrdersTypes from '../constants/OrdersActionType';
import * as PaymentMethosActionTypes from '../constants/PaymentMethosActionType';
import * as VisitorTypeActionTypes from '../constants/VisitorTypeActionType';
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
        case CategoriesType.EDIT_CATEGORY:
            return action.category
        case OrdersTypes.EDIT_ORDER:
            return action.order
        case PaymentMethosActionTypes.EDIT_PAYMENT_METHOD_TYPE:
            return action.paymentMethod
        case VisitorTypeActionTypes.EDIT_VISISTOR_TYPE:
            return action.visitorType
        default:
            return state;
    }
}

export default itemEditing;