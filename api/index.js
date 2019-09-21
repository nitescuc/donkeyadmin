const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const tubes = require('./src/tubes');
tubes.setup({
    io
});
const models = require('./src/models');
const drive = require('./src/drive');
drive.setup({
    io
});

const configServerModule = require('./src/configServer');

const configServer = new configServerModule.ConfigServer();

io.on('connection', function(socket){
    console.log('a user connected');
});

app.use(cors());
//
app.use('/api/tubes', tubes);
app.use('/api/models', models);
app.use('/api/drive', drive);
app.use('/api/config', configServerModule.router);

/*app.use(express.static(path.join(__dirname, '../app/build'), {
    extensions: ['html', 'css', 'js', 'png']
}));*/
app.use(express.static(path.join(__dirname, '../app/build')));

http.listen(8080);