const zmq = require('zmq');
const config = require('config');
const express = require('express');
const router = express.Router();

let conf;

class ConfigServer {
    constructor() {
        this.publisher = zmq.socket('pub');
        
        this.publisher.bind(config.configServer.bind, function(err) {
            if(err)
                console.log(err);
            else
                console.log('Listening on ', config.configServer.bind);
        });
    }

    static getServer() {
        if (!conf) conf = new ConfigServer();
        return conf;
    }

    setConfig(payload) {
        this.publisher.send(['config', JSON.stringify(payload)]);
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

    res.json('ok');
});

module.exports = { ConfigServer, router };