const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const tubes = require('./src/tubes');
const models = require('./src/models');
const drive = require('./src/drive');
drive.setup({
    io
});

io.on('connection', function(socket){
    console.log('a user connected');
});

app.use(cors());
//
app.use('/api/tubes', tubes);
app.use('/api/models', models);
app.use('/api/drive', drive);

/*app.use(express.static(path.join(__dirname, '../app/build'), {
    extensions: ['html', 'css', 'js', 'png']
}));*/
app.use(express.static(path.join(__dirname, '../app/build')));

http.listen(8080);