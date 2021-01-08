const http = require('http');
const fs = require('fs');

const port = 9003;
const url = 'https://biud436.com:9001';

function status(req, res) {
       http.get(url, function (response) {
            // Its Online
            res.writeHead(200, {
                'Content-Type': 'image/svg+xml'
            });
            fs.createReadStream('../badges/online.svg').pipe(res);
        }).on('error', function(e) {
            // Its Offline
            res.writeHead(200, {
                'Content-Type': 'image/svg+xml'
            });
            fs.createReadStream('../badges/offline.svg').pipe(res);            
    });
};

http.createServer(status).listen(port);