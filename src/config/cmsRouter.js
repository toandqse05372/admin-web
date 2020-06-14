import React from 'react';
import Places from '../cms/monopage/place/Places';
import Users from '../cms/monopage/user/Users';
import Games from '../cms/monopage/game/Games';
import Cities from '../cms/monopage/city/Cities';
import TicketTypes from '../cms/monopage/ticketType/TicketTypes';
import PlaceTypes from '../cms/monopage/placeType/PlaceTypes';
import PaymentMethods from '../cms/monopage/paymentMethod/PaymentMethods';

const cmsRouters = [
    {
        path :'/users',
        exact: false,
        main: ({history}) => <Users history={history}/>
    },
    {
        path :'/places',
        exact: false,
        main: ({history}) => <Places history={history}/>
    },
    {
        path :'/games',
        exact: false,
        main: ({history}) => <Games history={history}/>
    },
    {
        path :'/cities',
        exact: false,
        main: ({history}) => <Cities history={history}/>
    },
    {
        path :'/ticketTypes',
        exact: false,
        main: ({history}) => <TicketTypes history={history}/>
    },
    {
        path :'/placeTypes',
        exact: false,
        main: ({history}) => <PlaceTypes history={history}/>
    },
    {
        path :'/paymentMethods',
        exact: false,
        main: ({history}) => <PaymentMethods history={history}/>
    },
    
];
export default cmsRouters;