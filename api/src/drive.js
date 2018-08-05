const express = require('express');
const PythonShell = require('python-shell');
const path = require('path');
const config = require('config');

let options = {};

class Drive {
    constructor() {
        this.router = express.Router();
        this.configure(this.router);
    }
    configure(router) {
        router.post('/start', async (req, res) => {
            //
            const status = this.options.car.setModel(req.query.model);
            //
            res.json({
                status
            });
        });
        
        router.post('/stop', async (req, res) => {
            this.options.car.setModel();
            res.json({
                status: 'STOPPED'
            });
        });
        
    }
    setup(opt) {
        this.options = Object.assign(options, opt);
    }
}

    
module.exports = Drive;