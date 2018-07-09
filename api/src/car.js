"use strict"

const RemoteController = require('./remote');

class Car {
    status = {
        leftDistance: 0,
        frontDistance: 0
    }
    constructor(options) {
        this.io = options.io;
        this.driveMode = "user";
        this.remote = new RemoteController({
            channels: [20,21,22]
        });
        this.remote.addListener(20, (value) => {
            if (this.driveMode === "user") this.actuator.setSteering(value);
        });
        this.remote.addListener(21, (value) => {
            if (this.driveMode === "user") this.actuator.setThrottle(value);
        });
        this.remote.addListener(22, (value) => {
            if (this.driveMode === "user") this.driveMode = "auto";
            else this.driveMode = "user";
        });
    }
    autoDrive(status) {

    }
}