import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './cmsMenu.css';

const cmsMenus = [
    {
        name: 'User Manager',
        to: '/users',
        exact: true,
        role: ["ADMIN"]
    },
    {
        name: 'Place Manager',
        to: '/places',
        exact: true,
        role: ["ADMIN"]
    },
    {
        name: 'Category Manager',
        to: '/categories',
        exact: true,
        role: ["ADMIN"]
    },
    {
        name: 'Game Manager',
        to: '/games',
        exact: true,
        role: ["ADMIN"]
    },
    {
        name: 'City Manager',
        to: '/cities',
        exact: true,
        role: ["ADMIN"]
    },
    {
        name: 'Ticket Manager',
        to: '/ticketTypes',
        exact: true,
        role: ["ADMIN","STAFF"]
    },
    // {
    //     name: 'Payment Methods',
    //     to: '/paymentMethods',
    //     exact: true,
    //     role: ["ADMIN"]
    // },
    {
        name: 'Order Manager',
        to: '/orders',
        exact: true,
        role: ["ADMIN","STAFF"]
    },
    {
        name: 'Sales Report',
        to: '/report',
        exact: true,
        role: ["ADMIN","STAFF"]
    },
];

const CmsMenuLink = ({ label, to, activeOnlyWhenExact }) => {
    return (
        <Route
            path={to}
            exact={activeOnlyWhenExact}
            children={({ match }) => {
                var active = match ? 'active' : '';
                return (
                    <li className={active}>
                        <Link to={to}>
                            {label}
                        </Link>
                    </li>
                );
            }}
        />
    )
}


class CmsMenu extends Component {
    render() {
        return (
            <div id="sidebar-left" className="span2">
                <div className="nav-collapse sidebar-nav">
                    <ul className="nav nav-tabs nav-stacked main-menu">
                        {this.showCmsMenus(cmsMenus)}
                    </ul>
                </div>
            </div>
        );
    }

    showCmsMenus = (cmsMenus) => {
        var result = null;
        var { roles } = this.props
        if (cmsMenus.length > 0) {
            result = cmsMenus.map((menu, index) => {
                for (let i = 0; i < menu.role.length; i++) {
                    if (roles.includes(menu.role[i])) {
                        return (
                            <CmsMenuLink
                                key={index}
                                label={menu.name}
                                to={menu.to}
                                activeOnlyWhenExact={menu.exact}
                            />
                        );
                    }
                }
               

            });
        }
        return result;
    }
}

export default CmsMenu;
