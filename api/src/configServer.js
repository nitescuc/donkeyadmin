const mqtt = require('mqtt');
const config = require('config');
const express = require('express');
const router = express.Router();

let conf;

class ConfigServer {
    constructor() {
    }

    static getServer() {
        if (!conf) conf = new ConfigServer();
        return conf;
    }

    setConfig(payload) {
        const client = mqtt.connect(config.configServer.brokerUrl);
        client.on('error', e => {
            console.error('MQTT error:', e);
        });
        client.on('connect', () => {
            console.log('Mqtt connected');
            client.publish('config', JSON.stringify(payload));
        })
    }
}

router.post('/', async (req, res) => {
    if (!req.body) return res.status(400).json({
        error: 'Body required'
    });
    if (typeof req.body !== 'object') return res.status(400).json({
        error: 'Payload object required'
    });
    //
    ConfigServer.getServer().setConfig(req.body);

    res.json({
        status: 'ok'
    });
});

module.exports = { ConfigServer, router };