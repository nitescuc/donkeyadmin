const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('config');
const {promisify} = require('util');
const multer = require('multer');

const model_upload = multer({ storage: multer.diskStorage({
        destination: config.get('models.root'),
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }) 
})

const readdir = promisify(fs.readdir);

const router = express.Router();

router.get('/', async (req, res) => {
    const root = config.get('models.root');
    res.json((await readdir(root)).map((dir) => ({
        name: dir,
        url: `/models/${dir}`,
        $links: {
            drive: {
                $url: `/drive/model/${dir}`,
                $method: 'POST'
            },
            stop: {
                $url: `/drive/stop`,
                $method: 'POST'
            }
        }    
    })));
});

router.post('/', model_upload.single('model'), async (req, res) => {
    res.json({
        status: 'OK'
    })
});

module.exports = router;