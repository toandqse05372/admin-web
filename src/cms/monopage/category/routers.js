import React from 'react'; 
import CategoriesActionCMS from './CategoriesActionCMS';
import CategoriesCMS from './CategoriesCMS';


const routes = [
    {
        path: '/categories',
        exact: true,
        main: ({ location, history }) => <CategoriesCMS location={location} history={history}/>
    },
    {
        path: '/categories/add',
        exact: true,
        main: ({ location, history }) => <CategoriesActionCMS location={location} history={history} />
    },
    {
        path: '/categories/:id/edit',
        exact: true,
        main: ({ match, history }) => <CategoriesActionCMS match={match} history={history} />
    }
];

export default routes;