const express = require('express');
const PythonShell = require('python-shell');
const path = require('path');
const config = require('config');

let options = {};

class Drive {
    constructor(car) {
        this.car = car;
        this.router = express.Router();
        this.configure(this.router);
    }
    configure(router) {
        router.post('/start', async (req, res) => {
            //
            if (car.running) {
                return res.status(400).json({
                    message: 'Already running, stop first'
                });
            }
            //
            if (req.query.model) {

            } else {
                await this.car.startRecording((message) => {
                    options.io && options.io.emit('drive', {
                        type: 'message',
                        message
                    });
                });
            }
            //
            res.json({
                status: 'LAUNCHING'
            });
        });
        
        router.post('/stop', async (req, res) => {
            this.car.stopRecording();
            res.json({
                status: 'STOPPED'
            });
        });
        
        router.setup = (opt) => {
            options = Object.assign(options, opt);
        }
    }
}

    
module.exports = Drive;