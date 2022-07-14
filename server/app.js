const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// add after require() statements

const recording_data = [
    {
        id: 1,
        name: 'coffee-test-2',
        files: ["main", "depthlt", "gll", "glf", "grf", "grr", "eye", "hand" ],
        totalCameras: 6
    },
    {
        id: 0,
        name: 'coffee-test-1',
        files: ["main", "depthlt", "gll", "glf", "grf", "grr", "eye", "hand"],
        totalCameras: 6
    },
    {
        id: 2,
        name: '1654707334339',
        files: ["main", "depthlt", "gll", "glf", "grf", "grr" ],
        totalCameras: 6
    },
    {
        id: 3,
        name: '1654707308170',
        files: ["main", "depthlt", "gll", "glf", "grf", "grr" ],
        totalCameras: 6
    }
];

const videos = [
    {
        id: 0,
        poster: '/video/0/poster',
        duration: '3 mins',
        name: 'Sample 1'
    },
    {
        id: 1,
        poster: '/video/1/poster',
        duration: '4 mins',
        name: 'Sample 2'
    },
    {
        id: 2,
        poster: '/video/2/poster',
        duration: '2 mins',
        name: 'Sample 3'
    },
];

const app = express();

// add after 'const app = express();'

app.get('/video', (req, res) => {
    res.sendFile('assets/sample.mp4', { root: __dirname });
});

// add after existing app.get('/video', ...) route

app.use(cors());
app.get('/videos', (req, res) => res.json(videos));
app.get('/data', (req, res) => res.json(recording_data));

// add after app.get('/video/:id/data', ...) route

app.get('/video/:id/:filename', (req, res) => {
    const path = `assets/${req.params.id}/${req.params.filename}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        console.log("hey it is the sever");
        console.log(path);
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        console.log(head);
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
});

app.get('/files/:id/:filename', (req, res) => {
    console.log("get hand data");
    res.sendFile(`assets/${req.params.id}/${req.params.filename}.json`, { root: __dirname });
});

// add to end of file

app.listen(4000, () => {
    console.log('Listening on port 4000!')
});