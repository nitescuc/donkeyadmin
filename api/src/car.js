"use strict"

const i2cBus = require("i2c-bus");
const PythonShell = require('python-shell');
const path = require('path');

const config = require('config');

const RemoteController = require('./remote');
const Actuator = require('./actuator');
const DistanceArray = require('./distance');

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
            channels: config.get('car.remote.channels')
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
        this.actuator = new Actuator(config.get('car.actuator'));
        this.distanceArray = new DistanceArray({
            sensors: config.get('car.distance.sensors')
        });
        //
        this.pyshell = new PythonShell('autopilot.py', {
            pythonPath: config.get('car.pythonPath'),
            scriptPath: __dirname,
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
            this.io && this.io.emit('status', status);
        }, 1000);
    }
    async initialize() {
        this.i2c = await _getI2C();
        await this.actuator.initialize({
            i2c: this.i2c
        });
        this.actuator.setThrottle(1500);
        await this.distanceArray.initialize({
            i2c: this.i2c
        });
        this.distanceArray.on('data', (data) => {
            this.status.frontDistance = data[1];
            this.status.leftDistance = data[0];
            this.autoDrive(this.status);
        });
        this.distanceArray.startAcquisition(config.get('car.distance.period'));
    }
    autoDrive(status) {
        if (this.mode !== 'auto') return;
        this.pyshell.send(status);
    }
}

module.exports = Car;