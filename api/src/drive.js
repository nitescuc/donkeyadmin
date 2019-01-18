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
//    docker run -it --rm -p 8887:8887 -v ~/d2:/d2 -v ~/donkey:/donkey --device=/dev/video0:/dev/video0 --device=/dev/ttyACM0:/dev/ttyACM0 tazlogic/donkey:3.0.0_1.8.0 python /d2/manage.py drive
    if (req.query.model) args.push('--model', path.join(config.get('models.root'), req.query.model));
    if (req.query.record_on_local) args.push('--record_on_local');
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