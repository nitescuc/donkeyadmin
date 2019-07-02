import React, { Component } from 'react';
import { executeLink } from '../api/models.api';

class Drive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applyBlur: false,
            apiBaseUrl: ''
        }
    }
    async componentWillMount() {
        this.setState({
            apiBaseUrl: this.props.apiBaseUrl
        })
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.apiBaseUrl !== this.props.apiBaseUrl) {
            this.setState({
                apiBaseUrl: nextProps.apiBaseUrl
            })
        }
    }
    executeModelLink(link) {
        const self = this;
        return (e) => {
            executeLink(self.state.apiBaseUrl, link, self.props.onMessage);
        }
    }
    selectModel(model) {
        const self = this;
        return (e) => {
            self.setState({
                selectedModel: model
            })
        }
    }
    render() {
        const self = this;
        return (
            <div style={{textAlign:"left"}}>
                <h1>Drive</h1>
                <div class="row">
                    <div class="col-md-4">Apply blur</div>
                    <div class="col-md-8">
                        <input type="checkbox" onClick={(e) => { this.setState({ applyBlur: true }) }} checked={this.state.checked}></input>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default Drive;