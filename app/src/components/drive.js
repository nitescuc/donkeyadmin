import React, { Component } from 'react';
import { getModels, executeLink } from '../api/models.api';

class Drive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            models: [],
            apiBaseUrl: '',
            selectedModel: {
                name: "None"
            },
            mode: "user",
            stearing: 0,
            throttle: 0
        }
    }
    async loadModels(baseUrl) {
        const models = await getModels(baseUrl, this.props.onMessage);
        this.setState({
            models,
            apiBaseUrl: baseUrl || ''
        });
    }
    async componentWillMount() {
//        await this.loadModels(this.props.apiBaseUrl);
        this.setState({
            apiBaseUrl: this.props.apiBaseUrl
        })
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.apiBaseUrl !== this.props.apiBaseUrl) {
//            await this.loadModels(nextProps.apiBaseUrl);
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
                    <div class="col-md-4">Model</div>
                    <div class="col-md-8">
                        <div class="dropdown">
                            <button class="btn btn-outiline-secondary dropdown-toggle dropdown-toggle-split" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={(e) => { self.loadModels(self.state.apiBaseUrl)}}>
                                {this.state.selectedModel.name}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button class="dropdown-item" type="button" onClick={self.selectModel({ name: "None" })}>None</button>                            
                                <div class="dropdown-divider"></div>
                                {(self.state.models || []).map((model) => {
                                    return <button class="dropdown-item" type="button" onClick={self.selectModel(model)}>{model.name}</button>                            
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Mode</div>
                    <div class="col-md-8">
                        <div class="btn-group" role="group" aria-label="Mode">
                            <button type="button" className={this.state.mode == "user" ? "btn btn-primary" : "btn btn-outline-secondary"} onClick={(e) => { this.setState({ mode: "user" }) }}>User</button>
                            <button type="button" className={this.state.mode == "local_angle" ? "btn btn-primary" : "btn btn-outline-secondary"} onClick={(e) => { this.setState({ mode: "local_angle" }) }}>Local angle</button>
                            <button type="button" className={this.state.mode == "pilot" ? "btn btn-primary" : "btn btn-outline-secondary"} onClick={(e) => { this.setState({ mode: "pilot" }) }}>Pilot</button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Stearing/Throttle</div>
                    <div class="col-md-8 row" style={{ textAlign: "right" }}>
                        <div class="col-md-6">{this.state.stearing}</div>
                        <div class="col-md-6">{this.state.throttle}</div>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default Drive;