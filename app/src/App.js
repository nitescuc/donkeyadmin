import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Router from './components/Router';

import { executeLink } from './api/models.api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tempBaseUrl: '',
        messages: []
    }
  }
  onApiBaseUrlChange() {
    const self = this;
    return (e) => {
      self.setState({
        tempBaseUrl: e.target.value
      })
    }
  }
  validateApiUrl() {
    const self = this;
    return (e) => {
      self.setState({
        apiBaseUrl: self.state.tempBaseUrl
      });
    }
  }
  drive() {
    const self = this;
    return (e) => {
      executeLink(self.state.apiBaseUrl, {
        $url: '/drive/start?controller=pirf&sonar=yes',
        $method: 'POST'
      }, self.onMessage);
    }
  }
  stop() {
    const self = this;
    return (e) => {
      executeLink(self.state.apiBaseUrl, {
        $url: '/drive/stop',
        $method: 'POST'
      }, self.onMessage);
    }
  }
  //
  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="API url (leave empty if same server)" onChange={this.onApiBaseUrlChange()} value={this.state.tempBaseUrl} onBlur={this.validateApiUrl()} />
            <div className="input-group-append">
              <button type="button" className="btn btn-outline-primary" id="basic-addon2" onClick={this.validateApiUrl()}>Refresh</button>
              <button type="button" className="btn btn-outline-primary" id="basic-addon2" onClick={this.drive()}>Drive</button>
              <button type="button" className="btn btn-outline-danger" id="basic-addon2" onClick={this.stop()}>Stop</button>
            </div>          
            </div>
          </div>
              <Router apiBaseUrl={this.state.apiBaseUrl} />
          </div>
        </div>
    );
  }
}

export default App;
