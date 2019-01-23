import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
const config = require('../apps/config.json');

const email = config.email;
let transport;
if (email) {
   transport = nodemailer.createTransport({

    // host: 'smtp.mail.yahoo.ca',
    // port: 465,
    // secure: false,
    service: email.service, // 'yahoo',
    auth: {
      user: email.user, // 'onlinevlad@yahoo.ca',
      pass: email.pass, // 'XZsawq@!'
    },
    debug: false,
    //  logger: true
  });
}


let errors: string[] = [];

async function sendErrorEmail() {
  if (!transport) return;
  if (errors.length === 0) return;

  const mailOptions = {
    from: email.from, // onlinevlad@yahoo.ca',
    to: email.to, // 'uplight.ca@gmail.com', // list of receivers
    subject: email.subject, // 'ERROR Report',
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
  timeout = setTimeout(sendErrorEmail, 60000);
  if (errors.length > 200) sendErrorEmail();
};

function appendData(message1: any, message2: any, filename: string) {

  if (typeof message1 !== 'string') {
    try {
      message1 = JSON.stringify(message1);
    } catch (e) {
      console.log('appendData message1 ', message1);
    }
  }
  if (message2) {
    if (typeof message2 !== 'string') {
      try {
        message2 = JSON.stringify(message2);
      } catch (e) {
        console.log('appendData message2 ', message2);
      }
    }
  } else message2 = '';

  message1 = ' \n\r ' + new Date().toISOString() + ' \n\r ' + message1 + message2;
  fs.appendFile(filename, message1, 'utf8', (err) => {
    console.log(filename + '  ' + message1 + '  ' + err);
  });
}


export function myLoggerInit(id: string) {
  console.error = function (m1, m2) {
    if (m1 && m1.response)m1 = m1.response.status + ' ' +  m1.response.config.url;
    if (m2 && m2.Error) m2 = m2.Error;
    if (typeof m1 !== 'string') {
      try {
        m1 = JSON.stringify(m1);
      } catch (e) {

        console.log(' console.error   m1 ', Object.keys(m1));
      }
    }
    if (m2) {
      if (typeof m2 !== 'string') {
        try {
          m2 = JSON.stringify(m2);
        } catch (e) {
          console.log(' console.error m2 ', m2);
        }

      }
    } else m2 = '';
    appendData(m1, m2, 'logs/' + id + '-errors.txt');
    sendError(m1 + m2);
  };

  console.warn = function (m1, m2) {
    if (m1 && m1.Error) m1 = m1.Error;
    if (m2 && m2.Error) m2 = m2.Error;
    appendData(m1, m2, 'logs/' + id + '-warns.txt');
  };

  console.info = function (m1, m2) {
    if (m1 && m1.Error) m1 = m1.Error;
    if (m2 && m2.Error) m2 = m2.Error;
    appendData(m1, m2, 'logs/' + id + '-infos.txt');
  };
}
