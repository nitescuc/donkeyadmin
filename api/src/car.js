"use strict"

const i2cBus = require("i2c-bus");
const PythonShell = require('python-shell');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const writeFile = promisify(fs.writeFile);

const config = require('config');

const RemoteController = require('./remote');
const Actuator = require('./actuator');
const StatusLed = require('./statusLed');

function padTo8(number) {
    if (number<=99999999) { number = ("0000000"+number).slice(-8); }
    return number;
}
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
        // remote setup
        this.remote = new RemoteController({
            channels: config.get('car.remote.channels')
        });
        this.remote.on('steering', (value) => {
            if (this.status.driveMode === 'user' || this.status.driveMode === 'user_recording')
                this.setSteering(value);
        });
        this.remote.on('throttle', (value) => {
            if (this.status.driveMode !== 'auto')
                this.setThrottle(value);
        });
        this.remote.on('mode', (value) => {
            this.status.modeValue = value;
            this.changeMode(value);
        });
        // status led
        this.statusLed = new StatusLed(config.get('car.statusLed'));
        this.statusLed.setStatus(this.status.driveMode);
        //
        this.actuator = new Actuator(config.get('car.actuator'));
        //
/*        this.recorder_pyshell = new PythonShell(config.get('car.autopilot.recorder.script'), {
            pythonPath: config.get('car.autopilot.pythonPath'),
            scriptPath: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            cwd: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            mode: 'json',
            pythonOptions: ['-u']
        });*/
        //
        this.autopilot_pyshell = new PythonShell(config.get('car.autopilot.script'), {
            pythonPath: config.get('car.autopilot.pythonPath'),
            scriptPath: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            cwd: path.join(__dirname, '../..', config.get('car.autopilot.scripts_path')),
            mode: 'json',
            pythonOptions: ['-u']
        });
        this.autopilot_pyshell.on('message', (message) => {
            console.log('Autopilot Message', message);
            message = message || {};
            if (message.status === 'prediction') {
                switch(this.status.driveMode) {
                    case 'user':
                    case 'user_recording':
                        break;
                    case 'auto_steering':
                        this.setSteering(message.steering);
                        break;
                    case 'auto':
                        this.setSteering(message.steering);
                        this.setThrottle(message.throttle);
                        break;
                }
            }
        });               
        setInterval(() => {
            //console.log(JSON.stringify(this.status))
            //this.io && this.io.emit('status', this.status);
        }, 1000);
        this.recordInterval = setInterval(async () => {
            if (this.status.driveMode === 'user_recording' && this.status.normalizedThrottle > 0.05) {
                const index = padTo8(this.status.recordingIndex++);
                const image_path = index + '_cam_array.jpg';
                writeFile(path.join(this.status.recordingBasePath, `record_${index}.json`), JSON.stringify({
                    'user/angle': this.status.normalizedSteering,
                    'user/throttle': this.status.normalizedThrottle,
                    'cam/image_array': image_path                    
                }));
                this.autopilot_pyshell.send({
                    action: 'record',
                    path: path.join(this.status.recordingBasePath, image_path)
                });
            }
            if ((this.status.driveMode === 'auto' || this.status.driveMode === 'steering_auto') && this.modelLoaded) {
                // predict
                this.autopilot_pyshell.send({
                    action: 'predict'
                });
            }
        }, config.get('car.autopilot.interval'));
    }
    async startRecording() {
        this.recording = true;
        // get next tub
        this.status.recordingBasePath = path.join(config.tubes.root, 'tub_' + new Date().toISOString().replace(/:/g, '_'));
        fs.mkdirSync(this.status.recordingBasePath);
        this.status.recordingIndex = 0;
    }
    stopRecording() {
        this.recording = false;
    }
    setModel(model) {
        this.model = model;
        if (model) {
            this.autopilot_pyshell.send({
                action: 'load_model',
                model: path.join(config.models.root, model)
            });
        }
        this.changeMode(this.status.modeValue);
        return new Promise((resolve, reject) => {
            if (this.model) {
                this.autopilot_pyshell.once('message', (message) => {
                    console.log('Autopilot Message', message);
                    this.modelLoaded = true;
                    if (message.status) resolve(message.status);
                });
            } else resolve('STOPPED');
        });
    }
    //
    async initialize() {
        this.i2c = await _getI2C();
        await this.actuator.initialize({
            i2c: this.i2c
        });
        this.actuator.setThrottle(1500);
    }
    //
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
    changeMode(value) {
        if (this.status.modeValue > 1500) {
            if (this.model) this.status.driveMode = 'auto';
            else {
                this.status.driveMode = 'user_recording';
                this.startRecording();
            }
        }
        if (this.status.modeValue < 1500) {
            if (this.model) this.status.driveMode = 'auto_steering';
            else {
                this.status.driveMode = 'user';
                this.stopRecording();
            }
        }
        this.statusLed.setStatus(this.status.driveMode);
    }
}

module.exports = Car;