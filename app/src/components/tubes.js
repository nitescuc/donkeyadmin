import React, { Component } from 'react';
import { getTubes, downloadTube, learnAws } from '../api/tubes.api';
import { basename } from 'path';

class Tubes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tubes: [],
            apiBaseUrl: ''
        }
    }
    async loadTubes(baseUrl) {
        const tubes = await getTubes(baseUrl, this.props.onMessage);
        this.setState({
            tubes,
            apiBaseUrl: baseUrl || ''
        });
    }
    async componentWillMount() {
        await this.loadTubes(this.props.apiBaseUrl);
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.apiBaseUrl !== this.props.apiBaseUrl) await this.loadTubes(nextProps.apiBaseUrl);
    }
    downloadClick(baseurl, tuburl, tubname, onMessage) {
        return () => {
            downloadTube(baseurl, tuburl, tubname, onMessage);
        }
    }
    learnAwsClick(baseurl, tuburl, tubname, onMessage) {
        return () => {
            learnAws(baseurl, tuburl, tubname, onMessage);
        }
    }
    render() {
        return (
            <div>
            <h1>Tubes</h1>
            <div style={{ heigth: '300px', overflow: 'auto' }}>
            <ul className="list-group">
            {(this.state.tubes || []).map((tub, idx) => {
//                return <li className="list-group-item" key={idx}><a href={`${this.state.apiBaseUrl}${tub.url}`} target='_blank'>{tub.name}</a></li>
                return <li className="list-group-item" key={idx}>
                    <div className="row">
                        <div className="col-md-7"><span>{tub.name}</span></div>
                        <div className="col-md-3"><button className="btn btn-outline-primary" onClick={this.downloadClick(this.state.apiBaseUrl, tub.url, tub.name, this.props.onMessage)}>Download</button></div>
                        <div className="col-md-2"><button className="btn btn-outline" onClick={this.learnAwsClick(this.state.apiBaseUrl, tub.url, tub.name, this.props.onMessage)}>AWS</button></div>
                    </div>
                </li>
            })}
            </ul>
            </div>
            </div>
        )
    }
}

export default Tubes;