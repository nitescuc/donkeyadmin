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
        this.socket.on('tube', (message) => {
            this.props.onMessage({
                type: message.type,
                message: `${new Date().toISOString()} - TUBE - ${message.type} - ${message.message}`
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
            </div>
        )
    }
}

export default MessageBox;