import React from 'react';
import Places from '../cms/monopage/place/Places';
import Users from '../cms/monopage/user/Users';
import Games from '../cms/monopage/game/Games';
import Cities from '../cms/monopage/city/Cities';
import TicketTypes from '../cms/monopage/ticketType/TicketTypes';
import Categories from '../cms/monopage/category/Categories';
import PaymentMethods from '../cms/monopage/paymentMethod/PaymentMethods';
import Orders from '../cms/monopage/order/Orders';
import Error from '../cms/Error';
import Report from '../cms/report/Report';

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
        path :'/categories',
        exact: false,
        main: ({history}) => <Categories history={history}/>
    },
    {
        path :'/paymentMethods',
        exact: false,
        main: ({history}) => <PaymentMethods history={history}/>
    },
    {
        path :'/orders',
        exact: false,
        main: ({history}) => <Orders history={history}/>
    },
    {
        path :'/report',
        exact: false,
        main: ({history}) => <Report history={history}/>
    },
    {
        path :'/error',
        exact: false,
        main: ({history}) => <Error history={history}/>
    }
    
];
export default cmsRouters;