const VL53L0X = require('../src/tessel-vl53l0x');
const I2C = require('../src/tessel-i2c');

const sensor = new VL53L0X({
    I2C
});

sensor.on('distance', (message) => {
    console.log(message);
})
//sensor.startCapture();

/*sensor.startContinuous(100);

setTimeout(() => {
    console.log('Start reading');
    while(true) {
        console.log(sensor.readRangeContinuousMillimeters());
    }
}, 1000);
*/
setInterval(() => {
    sensor.singleCapture();
}, 100);
