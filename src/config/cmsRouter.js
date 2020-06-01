import React from 'react';
import Park from '../cms/monopage/park/Parks';
import TransactionCMS from '../cms/monopage/transaction/TransactionCMS';

const cmsRouters = [
    {
        path :'/parks',
        exact: false,
        main: ({history}) => <Park history={history}/>
    },
    {
        path :'/transaction',
        exact: false,
        main: ({history}) => <TransactionCMS history={history}/>
    }
    
];
export default cmsRouters;