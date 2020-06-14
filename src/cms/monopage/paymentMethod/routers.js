import React from 'react'; 
import PaymentMethodsActionCMS from './PaymentMethodsActionCMS';
import PaymentMethodsCMS from './PaymentMethodsCMS';


const routes = [
    {
        path: '/paymentMethods',
        exact: true,
        main: ({ location, history }) => <PaymentMethodsCMS location={location} history={history}/>
    },
    {
        path: '/paymentMethods/add',
        exact: true,
        main: ({ location, history }) => <PaymentMethodsActionCMS location={location} history={history} />
    },
    {
        path: '/paymentMethods/:id/edit',
        exact: true,
        main: ({ match, history }) => <PaymentMethodsActionCMS match={match} history={history} />
    }
];

export default routes;