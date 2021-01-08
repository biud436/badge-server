// const http = require('http');
// const fs = require('fs');

// const port = 9003;
// const url = 'https://biud436.com:9001';

// function status(req, res) {
//        http.get(url, function (response) {
//             // Its Online
//             res.writeHead(200, {
//                 'Content-Type': 'image/svg+xml'
//             });
//             fs.createReadStream('../badges/online.svg').pipe(res);
//         }).on('error', function(e) {
//             // Its Offline
//             res.writeHead(200, {
//                 'Content-Type': 'image/svg+xml'
//             });
//             fs.createReadStream('../badges/offline.svg').pipe(res);            
//     });
// };

// http.createServer(status).listen(port);

const express = require("express")
const http = require("http");
const https = require("https");
const static = require("serve-static");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");
const fs = require('fs');

// 익스프레스 객체 생성
const app = express();

app.set("port", process.env.PORT || 9003);
app.use(static(path.resolve("public")));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const router = express.Router();

router.route('/project_one').get((req, res) => {
    https.get("https://biud436.com:9001", function (response) {
        // Its Online
        res.set("Cache-control", "no-store");
        res.writeHead(200, {
            'Content-Type': 'image/svg+xml'
        });
        fs.createReadStream(path.resolve(__dirname, '../public/badges/online.svg')).pipe(res);
    }).on('error', function (e) {
        // Its Offline
        res.set("Cache-control", "no-store");
        res.writeHead(200, {
            'Content-Type': 'image/svg+xml'
        });
        fs.createReadStream(path.resolve(__dirname, '../public/badges/offline.svg')).pipe(res);
    });
});

// 라우터를 미들웨어로 등록
app.use("/", router);

// 서버 생성
const server = http.createServer(app).listen(app.get("port"), () => {

    console.log(`server start : %d`, app.get("port"));
});