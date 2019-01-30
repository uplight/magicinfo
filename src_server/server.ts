import * as express from 'express';
// import * as bodyParser from "body-parser";

import {AllDevicesController} from './apps/all-devices-controller';
import {myLoggerInit} from './com/my-logger';
const path = require('path');
// import * as readline from 'readline';
const config = require(path.join(__dirname, './apps/config.json'));

myLoggerInit('magic-info');
// import {getToken} from "./server/com/getToken";

// let express = require('express');
// let querystring = require('querystring');
// let http = require('http');
// let fs = require('fs');

// const cors = require('cors');

/*process.on('uncaughtException', function (err) {
  console.error(' logging uncaughtException', err);
});*/


const app: any = express();

// let parseString = require('xml2js').parseString;

const port = config.port;
// const PLAYERS = require('./server/models/devices');
// console.log('PLAYERS', PLAYERS);

app.use(express.static(path.join(__dirname, '../public')));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.text());
// app.use(cors({credentials: true}));
// app.use("/api", getToken);

// initApi(app);

function getHeaders(req) {

  const headers = JSON.parse(JSON.stringify(req.headers));
 //  console.log(headers);

  /*const headers = JSON.parse(JSON.stringify(req.headers));



  if(headers['x-cookie']) headers['Cookie'] = headers['x-cookie'];
  delete headers['x-cookie'];
  delete headers.host;
  delete headers.referer;
  delete headers.cookie;
  delete headers.origin;*/

  return {
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0',
    'X-CSRF-TOKEN': headers['x-csrf-token'], // 'd367ba09-8513-46ad-ae0b-841ec5539428',
    'Cookie': headers['x-cookie'] // 'JSESSIONID=F93734921569418000334530DD946EE1;'
  };
}



app.get('/api/getDevices', function (req: Request, resp: any) {
  resp.header('Content-Type', 'application/json');
  resp.sendFile(path.join(__dirname, '../public/images/devicesList.json'));
 });


const server = app.listen(port, function (data) {
  console.log('app listening on port ' + port, server.address().address);
});

/*
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('username: ', (username) => {
  rl.question('password: ', (password) => {
    const deviceController = new AllDevicesController(username, password);
    rl.close();
    const server = app.listen(port, function (data) {
      console.log('app listening on port ' + port, server.address().address);
    });
  });
});
*/

