import React, { Component } from 'react';
import '../App.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import cmsRoutes from '../config/cmsRouter';
import CmsMenu from './CmsMenu';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import callApi from '../utils/apiCaller'
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';

class CmsParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            roles: [],
            isActive: false
        }
    }

    logOut = () => {
        var token = localStorage.getItem('tokenLogin')
        callApi('login/logout', 'POST', null).then(res => {
            if (res) {
                localStorage.removeItem('tokenLogin');
                window.location.reload()
            }
        }).catch(function (error) {
            NotificationManager.error('Error  message', 'Something wrong');
        });
    }

    componentWillMount() {
        var jwtDecode = require('jwt-decode')
        var token = localStorage.getItem('tokenLogin')
        var decoded = jwtDecode(token)
        this.setState({
            username: decoded.user.lastName + " " + decoded.user.firstName,
            roles: decoded.user.authorities
        })
    }

    render() {
        const { username, isActive } = this.state
        const { overlay } = this.props
        return (
            <LoadingOverlay
                active={overlay.status}
                spinner
                text={overlay.detail}
            >
                <div className="navbar">
                    <div className="navbar-inner">
                        <div className="container-fluid">
                            <a className="btn btn-navbar" data-toggle="collapse" data-target=".top-nav.nav-collapse,.sidebar-nav.nav-collapse">
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </a>
                            <a className="brand" href="/"><span>GOBOKI</span></a>

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
                                                    Log out
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
                <div className="container-fluid-full" id="app">
                    <div className="row-fluid">
                        <CmsMenu roles={this.state.roles} />
                        <div id="content" className="span10">
                            {this.showContentMenus(cmsRoutes)}
                        </div>
                    </div>
                </div>
                <NotificationContainer />

            </LoadingOverlay>
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


const mapStateToProps = state => {
    return {
        overlay: state.overlay
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CmsParent);
