"use strict"

const RemoteController = require('./remote');
const Actuator = require('./actuator');

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
        this.remote = new RemoteController({
            channels: [18,23,22]
        });
        this.remote.addListener(18, (value) => {
            this.status.steering = value;
            if (this.driveMode === "user") this.actuator.setSteering(value);
        });
        this.remote.addListener(23, (value) => {
            this.status.throttle = value;
            if (this.driveMode === "user") this.actuator.setThrottle(value);
        });
        this.remote.addListener(22, (value) => {
            if (this.status.throttle < 100) return;
            if (this.driveMode === "user") this.driveMode = "auto";
            else this.driveMode = "user";
        });
        setTimeout(1000, console.log(JSON.stringify(status)));
    }
    autoDrive(status) {

    }
}

module.exports = Car;