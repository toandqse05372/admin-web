import React from 'react'; 
import CitiesActionCMS from './CitiesActionCMS';
import CitiesCMS from './CitiesCMS';


const routes = [
    {
        path: '/cities',
        exact: true,
        main: ({ location, history }) => <CitiesCMS location={location} history={history}/>
    },
    {
        path: '/cities/add',
        exact: true,
        main: ({ location, history }) => <CitiesActionCMS location={location} history={history} />
    },
    {
        path: '/cities/:id/edit',
        exact: true,
        main: ({ match, history }) => <CitiesActionCMS match={match} history={history} />
    }
];

export default routes;