"use strict"

const i2cBus = require("i2c-bus");
const PCA9685 = require('pca9685').Pca9685Driver;

class Actuator {
    constructor() {}

    async initialize() {
        return new Promise((resolve, reject) => {
            this.pwm = new PCA9685({
                i2c: i2cBus.openSync(1),
                address: 0x40,
                frequency: 60,
                debug: false
            }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
    setSteering(value) {
        this.pwm.setPulseLength(0, value);
    }
    setThrottle(value) {
        this.pwm.setPulseLength(1, value);
    }
}