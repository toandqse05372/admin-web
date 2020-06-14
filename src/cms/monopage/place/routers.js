import React from 'react'; 
import PlacesActionCMS from './PlacesActionCMS';
import PlacesCMS from './PlacesCMS';

const routes = [
    {
        path: '/places',
        exact: true,
        main: ({ location, history }) => <PlacesCMS location={location} history={history}/>
    },
    {
        path: '/places/add',
        exact: true,
        main: ({ location, history }) => <PlacesActionCMS location={location} history={history} />
    },
    {
        path: '/places/:id/edit',
        exact: true,
        main: ({ match, history }) => <PlacesActionCMS match={match} history={history} />
    }
];

export default routes;