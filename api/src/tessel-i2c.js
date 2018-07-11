const i2c = require('i2c-bus');

class I2C {
    constructor (address) {
        this.i2c = i2c.openSync(1);
        this.address = address;
    }
    transfer(addressToRead, bytesToRead, cb) {
        if (!bytesToRead) bytesToRead = 1;
        this.i2c.readI2cBlock(this.address, addressToRead[0], bytesToRead, new Buffer(bytesToRead), (err, length, buffer) => {
            cb(err, buffer);
        });
    }
    send(buffer, cb) {
        this.i2c.writeByte(this.address, buffer[0], buffer[1], cb);
    }
}

module.exports = I2C;