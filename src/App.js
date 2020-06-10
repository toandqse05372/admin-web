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
    }
  }
  render() {
    return (

      <Router>
        {/* <LoginCMS/> */}
        <CmsParent/>
       

      </Router>
    );
  }

}


export default App;
