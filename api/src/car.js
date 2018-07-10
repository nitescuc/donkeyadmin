"use strict"

const i2cBus = require("i2c-bus");
const PythonShell = require('python-shell');
const path = require('path');

const config = require('config');

const RemoteController = require('./remote');
const Actuator = require('./actuator');

const _getI2C = async () => {
    return new Promise((resolve, reject) => {
        const i2c = i2cBus.open(1, (error) => {
            if (error) reject(error);
            else resolve(i2c);
        });
    });
}
class Car {
    constructor(options) {
        this.status = {
            leftDistance: 0,
            frontDistance: 0,
            steering: 0,
            throttle: 0
        }
        this.io = options.io;
        this.driveMode = "user";
        //
        this.remote = new RemoteController({
            channels: [{
                pin: 18
            }, {
                pin: 23
            }, { 
                pin: 22
            }]
        });
        this.remote.addListener(0, (value) => {
            this.status.steering = value;
            if (this.driveMode === "user") this.actuator.setSteering(value);
        });
        this.remote.addListener(1, (value) => {
            this.status.throttle = value;
            if (this.driveMode === "user") this.actuator.setThrottle(value);
        });
        this.remote.addListener(2, (value) => {
            if (this.status.throttle < 100) return;
            if (this.driveMode === "user") this.driveMode = "auto";
            else this.driveMode = "user";
        });
        //
        this.actuator = new Actuator();
        //
        this.pyshell = new PythonShell('autopilot.py', {
            pythonPath: config.get('car.pythonPath'),
            scriptPath: path.join(__dirname, 'autopilot.py'),
            cwd: __dirname,
            mode: 'json',
            pythonOptions: ['-u']
        });
        this.pyshell.on('message', (message) => {
            if (driveMode !== "auto") return;
            if (message) {
                if (message.steering) this.actuator.setSteering(message.steering);
                if (message.throttle) this.actuator.setThrottle(message.throttle);
            }
        });
               
        setInterval(() => {
            console.log(JSON.stringify(this.status))
        }, 1000);
    }
    async initialize() {
        this.i2c = await _getI2C();
        await this.actuator.initialize({
            i2c: this.i2c
        });
    }
    autoDrive(status) {
        if (this.mode !== 'auto') return;
        this.pyshell.send(status);
    }
}

module.exports = Car;