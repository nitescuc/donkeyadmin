const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const tubes = require('./src/tubes');
const models = require('./src/models');
const drive = require('./src/drive');

const Car = require('./src/car');

drive.setup({
    io
});

io.on('connection', function(socket){
    console.log('a user connected');
});

app.use(cors());
//
app.use(express.static(path.join(__dirname, '../app/build'), {
    extensions: ['html', 'css', 'js', 'png']
}));
app.use('/tubes', tubes);
app.use('/models', models);
app.use('/drive', drive);

const car = new Car({
    io
});
car.initialize();

http.listen(8080);