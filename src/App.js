import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import cmsRoutes from './config/cmsRouter';
import CmsParent from './cms/CmsParent';
import LoginCMS from './cms/authen/LoginCMS';
import callApi from './utils/apiCaller'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      tokenLoginGot: null
    }
  }

  componentWillMount() {
    var tokenLogin = JSON.parse(localStorage.getItem('tokenLogin'));
    if (tokenLogin !== null) {
      callApi('login/checkToken', 'POST', null).then(res => {
        if (res) {
          this.setState({
            loaded: true
          })
        }
      }).catch(function (error) {
        localStorage.removeItem('tokenLogin');
        window.location.reload();
      });
    }
  }

  render() {
    const { loaded } = this.state;
    if (loaded) {
      return (
        <Router>
          <CmsParent />
        </Router>
      )
    } else {
      return (
        <Router>
          <LoginCMS />
        </Router>
      );
    }


  }

}


export default App;
