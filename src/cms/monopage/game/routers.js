import React from 'react'; 
import GamesActionCMS from './GamesActionCMS';
import GamesCMS from './GamesCMS';

const routes = [
    {
        path: '/games',
        exact: true,
        main: ({ location, history }) => <GamesCMS location={location} history={history}/>
    },
    {
        path: '/games/add',
        exact: true,
        main: ({ location, history }) => <GamesActionCMS location={location} history={history} />
    },
    {
        path: '/games/:id/edit',
        exact: true,
        main: ({ match, history }) => <GamesActionCMS match={match} history={history} />
    }
];

export default routes;