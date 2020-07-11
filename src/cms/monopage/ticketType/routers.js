import React from 'react'; 
import TicketTypesActionCMS from './TicketTypesActionCMS';
import TicketTypesCMS from './TicketTypesCMS';
import VistorTypesActionCMS from './VistorTypesActionCMS';

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
        path: '/ticketTypes/:id/edit',
        exact: true,
        main: ({ match, history }) => <TicketTypesActionCMS match={match} history={history} />
    },
    {
        path: '/ticketTypes/vistors/:id/edit',
        exact: true,
        main: ({ match, history }) => <VistorTypesActionCMS match={match} history={history} />
    },
    {
        path: '/ticketTypes/vistors/add',
        exact: true,
        main: ({ location, history }) => <VistorTypesActionCMS location={location} history={history} />
    }
];

export default routes;