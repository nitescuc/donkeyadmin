"use strict"

const PCA9685 = require('pca9685').Pca9685Driver;

class Actuator {
    constructor(config) {
        this.steeringChannel = config.steeringChannel;
        this.throttleChannel = config.throttleChannel;
    }

    async initialize(options) {
        return new Promise((resolve, reject) => {
            this.pwm = new PCA9685({
                i2c: options.i2c,
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
        if (!this.pwm) return;
        this.pwm.setPulseLength(this.steeringChannel, value);
    }
    setThrottle(value) {
//        if (value !== 1500 && value < 1550 && value > 1450) return;
        if (!this.pwm) return;
        this.pwm.setPulseLength(this.throttleChannel, value);
    }
}

module.exports = Actuator;