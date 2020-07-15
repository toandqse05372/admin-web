import React from 'react'; 
import TicketTypesActionCMS from './TicketTypesActionCMS';
import TicketTypesCMS from './TicketTypesCMS';
import VisitorTypesActionCMS from './VisitorTypesActionCMS';

const routes = [
    {
        path: '/ticketTypes',
        exact: true,
        main: ({ location, history }) => <TicketTypesCMS location={location} history={history}/>
    },
    {
        path: '/ticketTypes/add',
        exact: true,
        main: ({ location, history }) => <TicketTypesActionCMS location={location} history={history} />
    },
    {
        path: '/ticketTypes/:place/:id/edit',
        exact: true,
        main: ({ match, history }) => <TicketTypesActionCMS match={match} history={history} />
    },
    {
        path: '/ticketTypes/visitors/a/:id/edit',
        exact: true,
        main: ({ match, history }) => <VisitorTypesActionCMS match={match} history={history} />
    },
    {
        path: '/ticketTypes/visitors/add',
        exact: true,
        main: ({ location, history }) => <VisitorTypesActionCMS location={location} history={history} />
    }
];

export default routes;