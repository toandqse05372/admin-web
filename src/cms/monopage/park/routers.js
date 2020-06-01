import React from 'react'; 
import ParksActionCMS from './ParksActionCMS';
import ParksCMS from './ParksCMS';

const routes = [
    {
        path: '/parks',
        exact: true,
        main: ({ location, history }) => <ParksCMS location={location} history={history}/>
    },
    {
        path: '/parks/add',
        exact: true,
        main: ({ location, history }) => <ParksActionCMS location={location} history={history} />
    },
    {
        path: '/parks/:id/edit',
        exact: true,
        main: ({ match, history }) => <ParksActionCMS match={match} history={history} />
    }
];

export default routes;