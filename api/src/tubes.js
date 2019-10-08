const express = require('express');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const config = require('config');
const {promisify} = require('util');
const { S3Helper } = require('@nitescuc/training-aws-helper');

const readdir = promisify(fs.readdir);
const fsstat = promisify(fs.stat);

let options = {};

const router = express.Router();

router.get('/', async (req, res) => {
    const root = config.get('tubes.root');
    res.json((await readdir(root)).map((dir) => ({
        name: dir,
        url: `/tubes/${dir}`    
    })));
});

router.get('/:tubId', (req, res) => {
    const root = config.get('tubes.root');
    const archive = archiver('zip');
    archive.pipe(res);
    archive.directory(path.join(root, req.params.tubId));
    archive.finalize();
});

router.post('/:tubId/learn-aws', (req, res) => {
    const root = config.get('tubes.root');
    const folder = path.join(root, req.params.tubId);
    res.json({
        result: 'ok'
    })
    const s3Helper = new S3Helper({
        Bucket: 'robocars',
        TrainingImage: '263430657496.dkr.ecr.eu-west-1.amazonaws.com/robocars:1.12.3-gpu-py3',
        RoleArn: 'arn:aws:iam::263430657496:role/service-role/AmazonSageMaker-ExecutionRole-20180512T173485',
        HyperParameters: {
            'enhance_image_count': '50000',
            'use_generator': 'false',
            'slide': '4'
        },
        EnableManagedSpotTraining: true
    });
    s3Helper.on('progress', progress => {
        options.io && options.io.emit('tube', {
            type: 'message',
            message: `Loaded: ${progress.loaded}`
        })
    });
    s3Helper.on('job_status', status => {
        const lastStatus = status.SecondaryStatusTransitions[status.SecondaryStatusTransitions.length -1];
        options.io && options.io.emit('tube', {
            type: 'message',
            message: `Status: ${lastStatus.Status}-${lastStatus.StatusMessage}`
        })
    });
    s3Helper.uploadFolderToZip(folder, `data/${req.params.tubId}/images.zip`).then(() => {
        return s3Helper.createTrainingJob(`s3://robocars/data/${req.params.tubId}`);
    }).then(result => {
        console.log('CreateJob result', result);
    }).catch(e => {
        console.error('Error', e);
        options.io && options.io.emit('tube', {
            type: 'error',
            message: e.message || e
        })
    });
});

router.setup = (opt) => {
    options = Object.assign(options, opt);
}

module.exports = router;