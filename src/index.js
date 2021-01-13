const express = require("express");
require('express-async-errors');

const http = require("http");
const https = require("https");
const static = require("serve-static");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");
const fs = require('fs');
const ShortUrl = require('./mysql');

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

// Controller
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

// Controller
router.route("/insertUrl").get((req, res) => {
    const query = req.query;
    const shortUrl = new ShortUrl();
    const url = query.url;
    shortUrl.insert(url);

    shortUrl.get(key, (err, result) => {
        if(err) {
            res.json({
                success: false,
                message: err
            });
            
            return;
        }
        const url = result[0].urlValue;

        res.json({
            success: true,
            shortUrl: url
        });        
    });
});

router.route("/*").get(async (req, res, next) => {
    let key = req.path.slice(1);

    const shortUrl = new ShortUrl();
    await shortUrl.get(key, (err, result) => {

        myErr = () => {
            res.writeHead('200', {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.write(JSON.stringify({
                success: false,
                message: err
            }));
            res.end();
        };

        if (err) {
            myErr();
            next();
            return;
        }

        const url = result[0].urlValue;

        if (url) {
            res.redirect(url);
        } else {
            myErr();
        }

    });    

});

// 라우터를 미들웨어로 등록
app.use("/", router);

// 서버 생성
const server = http.createServer(app).listen(app.get("port"), () => {
    console.log(`server start : %d`, app.get("port"));
});