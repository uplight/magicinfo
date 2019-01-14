import * as moment from 'moment';
import * as nodemailer from 'nodemailer';

import * as fs from 'fs';
import * as path from 'path';

const transport = nodemailer.createTransport({
  // host: 'smtp.mail.yahoo.ca',
  // port: 465,
  // secure: false,
  service: 'yahoo',
  auth: {
    user: 'onlinevlad@yahoo.ca',
    pass: 'XZsawq@!'
  },
  debug: false,
 //  logger: true
});

let errors: string[] = [];

async function sendErrorEmail() {
  if (errors.length === 0) return;

  const mailOptions = {
    from: 'onlinevlad@yahoo.ca',
    to: 'uplight.ca@gmail.com', // list of receivers
    subject: 'ERROR Report',
    text: errors.toString()
  };
  errors = [];
  // console.log(mailOptions);
  try {
    const info = await transport.sendMail(mailOptions);
    console.info('email result', info);
  } catch (e) {
    console.warn(' ransport.sendMail   error ', e);
  }
}

let timeout;
const sendError = function (error: string) {
  errors.push(error);
  clearTimeout(timeout);
  sendErrorEmail();
  timeout = setTimeout(sendErrorEmail, 60000);
};

function appendData(message1: any, message2: any, filename: string) {

  if (typeof message1 !== 'string') message1 = JSON.stringify(message1);
  if (message2) {
    if (typeof message2 !== 'string') message2 = JSON.stringify(message2);
  } else message2 = '';

  message1 = ' \n\r ' + new Date().toISOString() + ' \n\r ' + message1 + message2;
  fs.appendFile(filename, message1, 'utf8', (err) => {
    console.log(filename + '  ' + message1 + '  ' + err);
  });
}


export function myLoggerInit(id: string) {
  console.error = function (m1, m2) {
    appendData(m1, m2, 'logs/' + id + '-errors.txt');
    if (typeof m1 !== 'string') m1 = JSON.stringify(m1);
    if (m2) {
      if (typeof m2 !== 'string') m2 = JSON.stringify(m2);
    } else m2 = '';
    sendError(m1 + m2);
  };

  console.warn = function (m1, m2) {
    appendData(m1, m2, 'logs/' + id + '-warns.txt');
  };

  console.info = function (m1, m2) {
    appendData(m1, m2, 'logs/' + id + '-infos.txt');
  };
}
