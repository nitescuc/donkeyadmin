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
            steering: 0,
            throttle: 0,
            driveMode: 'user'
        }
        this.io = options.io;
        //
        this.remote = new RemoteController({
            channels: config.get('car.remote.channels')
        });
        this.remote.on('steering', (value) => {
            if (this.driveMode === 'user')
                this.setSteering(value);
        });
        this.remote.on('throttle', (value) => {
            if (this.driveMode === 'user')
                this.setThrottle(value);
        });
        this.remote.on('mode', (value) => {
            this.status.modeValue = value;
//            if (this.status.throttle < 100) return;
//            if (this.driveMode === "user") this.driveMode = "auto";
//            else this.driveMode = "user";
        });
        //
        this.actuator = new Actuator(config.get('car.actuator'));
        //
        this.recorder_pyshell = new PythonShell(config.get('car.autopilot.recorder.script'), {
            pythonPath: config.get('car.autopilot.pythonPath'),
            scriptPath: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            cwd: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            mode: 'json',
            pythonOptions: ['-u']
        });
        this.recorder_pyshell.on('message', (message) => {});
        //
        this.autopilot_pyshell = new PythonShell(config.get('car.autopilot.pilot.script'), {
            pythonPath: config.get('car.autopilot.pythonPath'),
            scriptPath: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            cwd: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            mode: 'json',
            pythonOptions: ['-u']
        });
        this.autopilot_pyshell.on('message', (message) => {
            message = message || {};
            switch(this.status.driveMode) {
                case 'user':
                    break;
                case 'auto_steering':
                    this.setSteering(message.steering);
                    break;
                case 'auto':
                    this.setSteering(message.steering);
                    this.setThrottle(message.throttle);
                    break;
            }
        });
               
        setInterval(() => {
            console.log(JSON.stringify(this.status))
            this.io && this.io.emit('status', this.status);
        }, 1000);
        this.recordInterval = setInterval(() => {
            this.recorder_pyshell.send(this.status);
        }, config.get('car.autopilot.recorder.interval'));
//        this.autopilotInterval = setInterval(() => {
//            this.record(this.status);
//        }, config.get('autopilot.pilot.interval'));
    }
    async initialize() {
        this.i2c = await _getI2C();
        await this.actuator.initialize({
            i2c: this.i2c
        });
        this.actuator.setThrottle(1500);
    }
    setSteering(value) {
        this.actuator.setSteering(value);
        this.status.steering = this.actuator.steering;
        this.status.normalizedSteering = this.actuator.normalizedSteering;
    }
    setThrottle(value) {
        this.actuator.setThrottle(value);
        this.status.throttle = this.actuator.throttle;
        this.status.normalizedThrottle = this.actuator.normalizedThrottle;
        this.status.readThrottle = value;
    }
}

module.exports = Car;