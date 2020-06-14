import React from 'react'; 
import PlaceTypesActionCMS from './PlaceTypesCMS';
import PlaceTypesCMS from './PlaceTypesCMS';


const routes = [
    {
        path: '/placeTypes',
        exact: true,
        main: ({ location, history }) => <PlaceTypesCMS location={location} history={history}/>
    },
    {
        path: '/placeTypes/add',
        exact: true,
        main: ({ location, history }) => <PlaceTypesCMS location={location} history={history} />
    },
    {
        path: '/placeTypes/:id/edit',
        exact: true,
        main: ({ match, history }) => <PlaceTypesCMS match={match} history={history} />
    }
];

export default routes;