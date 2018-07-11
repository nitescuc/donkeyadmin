const VL53L0X = require('../src/tessel-vl53l0x');
const I2C = require('../src/tessel-i2c');

const sensor = new VL53L0X({
    IC2
});

sensor.on('distance', (message) => {
    console.log(message);
})
sensor.startCapture();