import React, { Component } from 'react';
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom'
  
import Tubes from './tubes';
import Models from './models';
import Drive from './drive';
import MessageBox from './messages';

class Router extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }
  //
  onMessage() {
    const self = this;
    return (message) => {
      const messages = self.state.messages;
      messages.unshift(message);
      self.setState({
        messages
      })
    }
  }
    render() {
        const self = this;
        return (
            <BrowserRouter>
            <div>
            <div className="row">
                <ul className="nav">
                    <li className="nav-item"><Link to="/tubes" className="nav-link">Tubes</Link></li>
                    <li className="nav-item"><Link to="/models" className="nav-link">Models</Link></li>
                    <li className="nav-item"><Link to="/drive" className="nav-link">Drive</Link></li> 
                    <hr/>
                </ul>
            </div>
            <div className="row">
            <div className="col-md-6">
                <Route exact path="/tubes" render={(props) => (<Tubes apiBaseUrl={self.props.apiBaseUrl} onMessage={self.onMessage()} />)}/>
                <Route exact path="/models" render={(props) => (<Models apiBaseUrl={self.props.apiBaseUrl} onMessage={self.onMessage()} />)}/>
                <Route exact path="/drive" render={(props) => (<Drive apiBaseUrl={self.props.apiBaseUrl} onMessage={self.onMessage()} />)}/>
            </div>
            <div className="col-md-6">
              <MessageBox apiBaseUrl={this.props.apiBaseUrl} onMessage={this.onMessage()} messages={this.state.messages || []} />
            </div>
            </div>
            </div>
            </BrowserRouter>
        );
    }
}

export default Router;