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
        //
        this.remote = new RemoteController({
            channels: [{
                pin: 23
            }, {
                pin: 18
            }, { 
                pin: 22
            }]
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
        this.actuator = new Actuator();
        
        setInterval(() => {
            console.log(JSON.stringify(this.status))
        }, 1000);
    }
    async initialize() {
        await this.actuator.initialize();
    }
    autoDrive(status) {

    }
}

module.exports = Car;