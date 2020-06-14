import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './cmsMenu.css';

const cmsMenus = [
    {
        name: 'Quản lý người dùng',
        to: '/users',
        exact: true
    },
    {
        name: 'Quản lý địa điểm',
        to: '/places',
        exact: true
    },
    {
        name: 'Quản lý trò chơi',
        to: '/games',
        exact: true
    },
    {
        name: 'Quản lý tỉnh / thành',
        to: '/cities',
        exact: true
    },
    {
        name: 'Quản lý vé',
        to: '/ticketTypes',
        exact: true
    },
    {
        name: 'Quản lý loại địa điểm',
        to: '/placeTypes',
        exact: true
    },
    {
        name: 'Phương thức thanh toán',
        to: '/paymentMethods',
        exact: true
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
        if (cmsMenus.length > 0) {
            result = cmsMenus.map((menu, index) => {
                return (
                    <CmsMenuLink
                        key={index}
                        label={menu.name}
                        to={menu.to}
                        activeOnlyWhenExact={menu.exact}
                    />
                );
            });
        }
        return result;
    }
}

export default CmsMenu;
