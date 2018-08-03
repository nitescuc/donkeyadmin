"use strict"

const Gpio = require('pigpio').Gpio;
const EventEmitter = require("events").EventEmitter;

class RemoteController extends EventEmitter {
    analogHandler(lv, tick) {}
    addChannel(eventName, pin, handler) {
        const level = 1;
        this.channels[eventName] = {
            startTick: 0,
            level,
            gpio: new Gpio(pin, {
                mode: Gpio.INPUT,
                pullUpDown: Gpio.PUD_UP,
                alert: true
            })
        }
        this.channels[eventName].gpio.on('alert', handler);
    }
    constructor(config) {
        super();
        const ctrl = this;
        //
        const channelHandler = (lv, tick) => {
            let endTick, diff;
            if (lv === level) {
                result.startTick = tick;
            } else {
                endTick = tick;
                diff = (endTick >> 0) - (result.startTick >> 0);
                //
                ctrl.emmit(eventName, diff);
            }
        }
        //
        const modeHandler = (lv, tick) => {
            let endTick, diff;
            if (lv === level) {
                result.startTick = tick;
            } else {
                endTick = tick;
                diff = (endTick >> 0) - (result.startTick >> 0);
                //
                ctrl.emmit(eventName, diff);
            }
        }
        //
        this.config = config;
        this.channels = {};
        //
        this.addChannel('steering', config.channels.steering, channelHandler);
        this.addChannel('throttle', config.channels.throttle, channelHandler);
        this.addChannel('mode', config.channels.mode, channelHandler);
    }
}

module.exports = RemoteController;