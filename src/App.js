import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import cmsRoutes from './config/cmsRouter';
import CmsParent from './cms/CmsParent';
import LoginCMS from './cms/authen/LoginCMS';

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
    this.setState({
      tokenLoginGot: tokenLogin
    })
  }

  render() {
    const { tokenLoginGot } = this.state;
    if (tokenLoginGot !== null) {
      return (
        <Router>
          <CmsParent />
        </Router>
      )
    }
    
    return (
      <Router>
        <LoginCMS />
      </Router>
    );
  }

}


export default App;
