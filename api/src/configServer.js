const mqtt = require('mqtt');
const config = require('config');
const express = require('express');
const router = express.Router();

let conf;

class ConfigServer {
    constructor() {
        this.client = mqtt.connect(config.configServer.brokerUrl);
        this.client.on('error', e => {
            console.error('MQTT error:', e);
        });
    }

    static getServer() {
        if (!conf) conf = new ConfigServer();
        return conf;
    }

    setConfig(payload) {
        this.client.publish('config', JSON.stringify(payload));
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