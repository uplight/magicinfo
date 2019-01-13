import * as moment from 'moment';

const fs = require('fs');
import * as path from 'path';



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
  };

  console.warn = function (m1, m2) {
    appendData(m1, m2, 'logs/' + id + '-warns.txt');
  };

  console.info = function (m1, m2) {
    appendData(m1, m2, 'logs/' + id + '-infos.txt');
  };
}
