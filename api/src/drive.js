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
    const args = [];
    args.push('drive');
    if (req.query.model) args.push('--model', path.join(config.get('models.root'), req.query.model));
    if (req.query.controller) args.push('--' + req.query.controller);
    if (req.query.sonar) args.push('--sonar');
    if (req.query.record_on_local) args.push('--record_on_local');
    pyshell = new PythonShell('manage.py', {
        pythonPath: config.get('car.pythonPath'),
        scriptPath: config.get('car.path'),
        pythonOptions: ['-u'],
        args,
        cwd: config.get('car.cwd')
    });
    res.json({
        status: 'LAUNCHING'
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
        await request({
            method: 'POST',
            uri: `${config.get('api.baseUrl')}/config`,
            body: {
                model_path: `${config.get('models.root')}/${req.params.model_id}`
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