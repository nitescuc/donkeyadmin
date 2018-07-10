const VL53L0X = require('../src/vl53l0x/vl53l0x');

const sensor = new VL53L0X();

while (true) {
    sensor.readRangeSingleMillimiters();
}
