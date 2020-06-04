import React from 'react'; 
import UsersActionCMS from './UsersActionCMS';
import UserCMS from './UsersCMS';

const routes = [
    {
        path: '/users',
        exact: true,
        main: ({ location, history }) => <UserCMS location={location} history={history}/>
    },
    {
        path: '/users/add',
        exact: true,
        main: ({ location, history }) => <UsersActionCMS location={location} history={history} />
    },
    {
        path: '/users/:id/edit',
        exact: true,
        main: ({ match, history }) => <UsersActionCMS match={match} history={history} />
    }
];

export default routes;