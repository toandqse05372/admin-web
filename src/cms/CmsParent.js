import React, { Component } from 'react';
import '../App.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import cmsRoutes from '../config/cmsRouter';
import CmsMenu from './CmsMenu';

class CmsParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            username:''
        }
    }

    logOut = () => {
        localStorage.removeItem('tokenLogin');
        window.location.reload();
    }

    componentWillMount(){
        var jwtDecode = require('jwt-decode')
        var token = localStorage.getItem('tokenLogin')
        var decoded = jwtDecode(token)
        this.setState({
            username: decoded.user.lastName + " " +decoded.user.firstName
        })
    }

    render() {
        const {username} = this.state
        return (
            <div>
                <div className="navbar">
                    <div className="navbar-inner">
                        <div className="container-fluid">
                            <a className="btn btn-navbar" data-toggle="collapse" data-target=".top-nav.nav-collapse,.sidebar-nav.nav-collapse">
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </a>
                            <a className="brand" href="index.html"><span>GOBOKI</span></a>

                            {/* start: Header Menu */}
                            <div className="nav-no-collapse header-nav">
                                <ul className="nav pull-right">
                                    {/* start: User Dropdown */}
                                    <li className="dropdown">
                                        <a className="btn dropdown-toggle" data-toggle="dropdown">
                                            <i className="halflings-icon white user" /> {username}
                                            <span className="caret" />
                                        </a>

                                        <ul className="dropdown-menu">

                                            <li onClick={this.logOut} className='pointer'>
                                                <a>
                                                    <i type="button" onClick={this.logOut} className="halflings-icon off"
                                                    />
                                                    Đăng xuất
                                                </a>
                                            </li>

                                        </ul>
                                    </li>
                                    {/* end: User Dropdown */}
                                </ul>
                            </div>
                            {/* end: Header Menu */}
                        </div>
                    </div>
                </div>
                <div className="container-fluid-full">
                    <div className="row-fluid">
                        <CmsMenu />
                        <div id="content" className="span10">
                            {this.showContentMenus(cmsRoutes)}
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    showContentMenus = (cmsRoutes) => {
        var result = null;
        if (cmsRoutes.length > 0) {
            result = cmsRoutes.map((route, index) => {
                return (<Route

                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                />
                );
            });
        }
        return <Switch>{result}</Switch>
    }
}


export default CmsParent;
