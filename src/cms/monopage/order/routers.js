import React from 'react'; 
import OrderActionCMS from './OrderActionCMS';
import OrdersCMS from './OrdersCMS';


const routes = [
    {
        path: '/orders',
        exact: true,
        main: ({ location, history }) => <OrdersCMS location={location} history={history}/>
    },
    {
        path: '/orders/add',
        exact: true,
        main: ({ location, history }) => <OrderActionCMS location={location} history={history} />
    },
    {
        path: '/orders/:id/edit',
        exact: true,
        main: ({ match, history }) => <OrderActionCMS match={match} history={history} />
    }
];

export default routes;