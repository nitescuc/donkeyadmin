const express = require('express');
const PythonShell = require('python-shell');
const path = require('path');
const config = require('config');

const request = require('request-promise-native');

const router = express.Router();

let pyshell = null;
let options = {};
let status = {
    angle: 0,
    throttle: 0,
    mode: 'user',
    recording: false
}; 

const startPython = (mode) => {
    const args = [];
    args.push(mode);
    pyshell = new PythonShell('manage.py', {
        pythonPath: config.get('car.pythonPath'),
        scriptPath: config.get('car.path'),
        pythonOptions: ['-u'],
        args,
        cwd: config.get('car.cwd')
    });
    pyshell.on('message', (message) => {
        options.io && options.io.emit('drive', {
            type: 'message',
            message
        });
    });
    pyshell.on('close', () => {
        options.io && options.io.emit('drive', {
            type: 'close',
            message: 'Closed by python'
        });
        pyshell = null;
    });
    pyshell.on('error', (err) => {
        options.io && options.io.emit('drive', {
            type: 'error',
            message: err.message
        });
        pyshell = null;
    });
}

router.post('/start', async (req, res) => {
    //
    status = {
        angle: 0,
        throttle: 0,
        mode: 'user',
        recording: false
    };
    //
    if (pyshell) {
        return res.status(400).json({
            message: 'Already running, stop first'
        });
    }
    //
    startPython('drive');

    res.json({
        status: 'LAUNCHING'
    });
});
router.post('/record', async (req, res) => {
    //
    status = {
        angle: 0,
        throttle: 0,
        mode: 'user',
        recording: false
    };
    //
    if (pyshell) {
        return res.status(400).json({
            message: 'Already running, stop first'
        });
    }
    //
    startPython('record');

    res.json({
        status: 'LAUNCHING'
    });
});
router.post('/calibrate', async (req, res) => {
    //
    status = {
        angle: 0,
        throttle: 0,
        mode: 'user',
        recording: false
    };
    //
    if (pyshell) {
        return res.status(400).json({
            message: 'Already running, stop first'
        });
    }
    //
    startPython('calibrate');

    res.json({
        status: 'LAUNCHING'
    });
});

router.post('/stop', async (req, res) => {
    if (pyshell) {
        pyshell.childProcess.kill('SIGINT');
        pyshell = null;
    }
    res.json({
        status: 'STOPPED'
    });
});

router.post('/model/:model_id', async (req, res) => {
    if (req.params.model_id) {
        const root = config.has('models.dockerRoot') ? config.get('models.dockerRoot') : config.get('models.root');
        await request({
            method: 'POST',
            uri: `${config.get('api.baseUrl')}/config`,
            body: {
                model_path: `${root}/${req.params.model_id}`
            },
            json: true
        })
    }
    res.json({
        status: 'OK'
    });
});

// drive route for donkey
router.get('/controller', async (req, res) => {
    res.json(status);
});

// drive route for donkey
router.put('/controller', async (req, res) => {
    res.json({ status: "OK"});
});


router.setup = (opt) => {
    options = Object.assign(options, opt);
}
    
module.exports = router;