import * as express from "express";
// import * as bodyParser from "body-parser";
import * as request from 'request';
const path = require('path');
// import {getToken} from "./server/com/getToken";

// let express = require('express');
// let querystring = require('querystring');
// let http = require('http');
// let fs = require('fs');
const cors = require('cors');

process.on('uncaughtException', function (err) {
  console.error('uncaughtException', err);
});


let app: any = express();

// let parseString = require('xml2js').parseString;


const port: number = 49888;


// const PLAYERS = require('./server/models/devices');
// console.log('PLAYERS', PLAYERS);

app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.text());
app.use(cors({credentials: true}));
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
    'X-CSRF-TOKEN': headers['x-csrf-token'],// 'd367ba09-8513-46ad-ae0b-841ec5539428',
    'Cookie': headers['x-cookie'] // 'JSESSIONID=F93734921569418000334530DD946EE1;'
  }
}


app.get("/api/proxy/*", function (req: Request, resp: any) {
  const url = req.url.replace('/api/proxy/', '');
  //  console.log(req.headers);
  var options = {
    url: url,
    headers: getHeaders(req)
  };

  try {
    request(options).pipe(resp);
  } catch (e) {
    resp.json({error: url})
  }

});

app.post("/api/proxy/*", function (req: any, resp: any) {
  let url = req.url.replace('/api/proxy/', '');
  let body = '';
  req.on('data', function (chunk) {
    body += chunk.toString();
  });

  req.on('end', function () {
    //  console.log(body);
    var options = {
      url: url,
      method: 'POST',
      body: body,
      headers: getHeaders(req)
    };

     // console.log(options);
    try {
      request(options).pipe(resp);
    } catch (e) {
      resp.json({error: url})
    }
  });
});

const server = app.listen(port, function (data) {
  console.log('app listening on port ' + port, server.address().address);
});
