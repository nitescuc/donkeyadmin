"use strict"

const PCA9685 = require('pca9685').Pca9685Driver;

class Actuator {
    constructor(config) {
        this.steeringChannel = config.steeringChannel;
        this.throttleChannel = config.throttleChannel;
        this.throttleMax = config.throttleMax;
        this.throttleMin = config.throttleMin;
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
    normalizeSteering(value) {
        return (value - 1500)/500;
    }
    setSteering(value) {
        if (!this.pwm) return;
        if (Math.abs(value) <= 1) value = 1500 + value * 500;
        this.steering = value;
        this.normalizedSteering = this.normalizeSteering(value);
        this.pwm.setPulseLength(this.steeringChannel, value);
    }
    normalizeThrottle(value) {
        const dir = value - 1500;
        if (dir >= 0) return (dir / 500) * (this.throttleMax / 500);
        else return (dir / 500) * (this.throttleMin / 500);
    }
    denormalizeThrottle(value) {
        if (value >= 0) return 1500 + value * this.throttleMax;
        else return 1500 + value * this.throttleMin;
    }
    setThrottle(value) {
        if (!this.pwm) return;
        //
        //
        if (Math.abs(value) <= 1) value = this.denormalizeThrottle(value);
        else value = this.denormalizeThrottle(this.normalizeThrottle(value));
        //
        this.normalizedThrottle = this.normalizeThrottle(value);
        this.throttle = value;
        //
        this.pwm.setPulseLength(this.throttleChannel, value);
    }
}

module.exports = Actuator;