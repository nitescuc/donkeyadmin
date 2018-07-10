const PythonShell = require('python-shell');
const path = require('path');

const config = require('config');

const pyshell = new PythonShell('autopilot.py', {
    pythonPath: 'python',
    scriptPath: __dirname,
    cwd: __dirname,
    mode: 'json',
    pythonOptions: ['-u']
});
pyshell.on('message', (message) => {
    console.log('From python', message, typeof message);
});
pyshell.send({ leftDistance: 1, b: 2, c: 3 });

pyshell.send({ leftDistance: 4, b: 2, c: 3 });
