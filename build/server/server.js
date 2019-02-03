"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const my_logger_1 = require("./com/my-logger");
const path = require('path');
const config = require(path.join(__dirname, './apps/config.json'));
my_logger_1.myLoggerInit('magic-info');
const app = express();
const port = config.port;
app.use(express.static(path.join(__dirname, '../public')));
function getHeaders(req) {
    const headers = JSON.parse(JSON.stringify(req.headers));
    return {
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        'X-CSRF-TOKEN': headers['x-csrf-token'],
        'Cookie': headers['x-cookie']
    };
}
app.get('/api/getDevices', function (req, resp) {
    resp.header('Content-Type', 'application/json');
    resp.sendFile(path.join(__dirname, '../public/images/devicesList.json'));
});
const server = app.listen(port, function (data) {
    console.log('app listening on port ' + port, server.address().address);
});
