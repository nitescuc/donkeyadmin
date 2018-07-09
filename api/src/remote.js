"use strict"

const Gpio = require('pigpio').Gpio;

class RemoteController {
    constructor(config) {
        // config is:
        //   channels: [{ pin, level }, {...}] || [pin, ...]
        this.config = config;
        this.channels = [];
        //
        this.channels = (this.config.channels || []).map((channel) => {
            let pin, level;
            if (typeof channel == 'object') {
                pin = channel.pin;
                level = channel.level || 1;
            } else {
                pin = channel;
                level = 1;
            }
            const result = {
                startTick: 0,
                level,
                gpio: new Gpio(pin, {
                    mode: Gpio.INPUT,
                    alert: true
                }),
                callbacks: []
            }
            result.gpio.on('alert', (lv, tick) => {
                let endTick, diff;
                if (lv === level) {
                    result.startTick = tick;
                } else {
                    endTick = tick;
                    diff = (endTick >> 0) - (result.startTick >> 0);
                    //
                    for (let cb of result.callbacks) cb(diff);
                }
            });
            return result;
        });
    }
    //
    addListener(channel, cb) {
        //
        this.channels[channel].callbacks.push(cb);
    }
}

module.exports = RemoteController;