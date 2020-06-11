import React from 'react';
import Park from '../cms/monopage/park/Parks';
import User from '../cms/monopage/user/Users';
import Games from '../cms/monopage/game/Games';
import TransactionCMS from '../cms/monopage/transaction/TransactionCMS';

const cmsRouters = [
    {
        path :'/users',
        exact: false,
        main: ({history}) => <User history={history}/>
    },
    {
        path :'/parks',
        exact: false,
        main: ({history}) => <Park history={history}/>
    },
    {
        path :'/games',
        exact: false,
        main: ({history}) => <Games history={history}/>
    },
    {
        path :'/transaction',
        exact: false,
        main: ({history}) => <TransactionCMS history={history}/>
    }
    
];
export default cmsRouters;