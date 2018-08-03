"use strict"

const Gpio = require('pigpio').Gpio;
const EventEmitter = require("events").EventEmitter;

class RemoteController extends EventEmitter {
    analogHandler(lv, tick) {}
    addChannel(eventName, pin) {
        const ctrl = this;
        const level = 1;
        const channel = this.channels[eventName] = {
            startTick: 0,
            level,
            gpio: new Gpio(pin, {
                mode: Gpio.INPUT,
                pullUpDown: Gpio.PUD_UP,
                alert: true
            })
        }
        channel.gpio.on('alert', (lv, tick) => {
            let endTick, diff;
            if (lv === 1) {
                channel.startTick = tick;
            } else {
                endTick = tick;
                diff = (endTick >> 0) - (channel.startTick >> 0);
                //
                ctrl.emit(eventName, diff);
            }
        });
    }
    constructor(config) {
        super();
        const ctrl = this;
        //
        this.config = config;
        this.channels = {};
        //
        this.addChannel('steering', config.channels.steering);
        this.addChannel('throttle', config.channels.throttle);
        this.addChannel('mode', config.channels.mode);
    }
}

module.exports = RemoteController;