"use strict"

const EventEmitter = require("events").EventEmitter;
const Gpio = require('pigpio').Gpio;
const VL53LOX = require('./tessel-vl53l0x');
const I2C = require('./tessel-i2c');

const _setTimeout = (duration) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    })
}

class DistanceArray extends EventEmitter {
    constructor(config) {
        super();
        this.sensors = config.sensors;
    }
    async initialize(options) {
        this.i2c = new I2C(0x29, options.i2c);
        this.devices = [];
        for (let sensor of this.sensors) {
            const dd = {
                resetGpio: new Gpio(sensor.resetPin, { mode: Gpio.OUTPUT }),
                address: sensor.address,
                device: new VL53LOX({
                    i2c: this.i2c
                })
            }
            this.devices.push(dd);
            // hold it in reset
            dd.resetGpio.digitalWrite(0);
        }
        // set addresses
        for (let dev of this.devices) {
            dev.resetGpio.digitalWrite(1);
            // allow to boot
            await _setTimeout(100);
            // change address
            await dev.device.setAddress(dev.address);
        }            
    }
    async readData() {
        // write start sequence
        for (let dev of this.devices) {
            dev.device.writeSingleCaptureStart();
        }
        //
        this.emmit('data', this.devices.map((dev) => dev.device.readRangeContinuousMillimeters(false)));
    }
    async startAcquisition(period) {
        this.interval = setInterval(() => this.readData, period);
    }
}

module.exports = DistanceArray;