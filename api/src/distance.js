"use strict"

const EventEmitter = require("events").EventEmitter;
const Gpio = require('pigpio').Gpio;
const VL53LOX = require('./tessel-vl53l0x');
const I2C = require('./tessel-i2c');
const REGISTRY = require('./tessel-vl53l0x/registry');

const _setTimeout = (duration) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    })
}

const _i2c_send = (device, address, dataToWrite) => {
    return new Promise((resolve, reject) => {
        device.i2c.send(new Buffer([address, dataToWrite]), (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

const _readRegister = (device, address, bytesToRead) => {
    return new Promise((resolve, reject) => {
        device.i2c.transfer(new Buffer([addressToRead]), bytesToRead, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

const _readRange = async (device) => {
    const data = await _readRegister(device, REGISTRY.RESULT_RANGE_STATUS, 16);
    return (data.readInt16BE(8) + 10);
}

class DistanceArray extends EventEmitter {
    constructor(config) {
        super();
        this.sensors = config.sensors;
    }
    async initialize(options) {
        this.devices = [];
        for (let sensor of this.sensors) {
            const dd = {
                resetGpio: new Gpio(sensor.resetPin, { mode: Gpio.OUTPUT }),
                address: sensor.address,
                device: new VL53LOX({
                    i2c: new I2C(0x29, options.i2c)
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
            await _i2c_send(dev.device, REGISTRY.SYSRANGE_START, 0x02);
        }
        //
        this.emit('data', this.devices.map((dev) => _readRange(device)));
    }
    async startAcquisition(period) {
        this.interval = setInterval(() => this.readData(), period);
    }
}

module.exports = DistanceArray;