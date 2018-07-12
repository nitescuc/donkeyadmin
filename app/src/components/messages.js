import React, { Component } from 'react';
import io from 'socket.io-client';

class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            apiBaseUrl: ''
        }
    }
    socket = null;
    setupSocket(apiBaseUrl) {
        if (this.socket) this.socket.close();
        this.socket = io(apiBaseUrl || `${window.location.protocol}//${window.location.host}`);
        this.socket.on('drive', (message) => {
            this.props.onMessage({
                type: message.type,
                message: `${new Date().toISOString()} - DRIVE - ${message.type} - ${message.message}`
            });
        });
        this.socket.on('status', (message) => {
            this.setState({
                status: message
            });
        });
    }
    componentWillUnmount() {
        if (this.socket) this.socket.close();
        this.socket = null;
    }
    componentWillMount() {
        this.setupSocket(this.props.apiBaseUrl);
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
        if (this.props.apiBaseUrl !== nextProps.apiBaseUrl)
            this.setupSocket(nextProps.apiBaseUrl);
    }
    render() {
        return (
            <div>
                <h1>Messages</h1>
                <div style={{ 'text-align': 'left', height: '400px', overflow: 'auto' }}>
                    {this.state.messages.map((message) => {
                        if (typeof message === 'object') {
                            let color = 'black';
                            switch(message.type) {
                                case 'close':
                                case 'error':
                                    color = 'red';
                                    break;
                                case 'message':
                                    color = 'blue';
                                    break;
                                default:
                                    break;
                            }
                            return <div style={{ color }}>{message.message}</div>
                        } else return <div>{message}</div>
                    })}
                </div>
                <div class="row">
                <span class="col-md-6" style={{'text-align':'left'}}>Left distance</span><span class="col-md-6" style={{'text-align':'right'}}>{(this.state.status || {}).leftDistance}</span>
                <span class="col-md-6" style={{'text-align':'left'}}>Front distance</span><span class="col-md-6" style={{'text-align':'right'}}>{(this.state.status || {}).frontDistance}</span>
                <span class="col-md-6" style={{'text-align':'left'}}>Steering</span><span class="col-md-6" style={{'text-align':'right'}}>{(this.state.status || {}).steering}</span>
                <span class="col-md-6" style={{'text-align':'left'}}>Throttle</span><span class="col-md-6" style={{'text-align':'right'}}>{(this.state.status || {}).throttle}</span>
                </div>
            </div>
        )
    }
}

export default MessageBox;