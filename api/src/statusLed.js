"use strict"

const Gpio = require('pigpio').Gpio;

class StatusLed {
    constructor(config) {
        this.red = new Gpio(config.red, {
            mode: Gpio.OUTPUT
        });
        this.green = new Gpio(config.green, {
            mode: Gpio.OUTPUT
        });
        this.blue = new Gpio(config.blue, {
            mode: Gpio.OUTPUT
        });
    }
    setStatus(userMode) {
        const redValue = (userMode === 'auto' ? 1 : 0);
        const greenValue = (userMode === 'user_recording' ? 1 : 0);
        const blueValue = (userMode === 'auto_steering' ? 1 : 0);
        this.red.digitalWrite(redValue);
        this.green.digitalWrite(greenValue);
        this.blue.digitalWrite(blueValue);
    }
}

module.exports = StatusLed;