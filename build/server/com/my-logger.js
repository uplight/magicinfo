"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const fs = require("fs");
const config = require('../apps/config.json');
const email = config.email;
let transport;
if (email) {
    transport = nodemailer.createTransport({
        service: email.service,
        auth: {
            user: email.user,
            pass: email.pass,
        },
        debug: false,
    });
}
let errors = [];
async function sendErrorEmail() {
    if (!transport)
        return;
    if (errors.length === 0)
        return;
    const mailOptions = {
        from: email.from,
        to: email.to,
        subject: email.subject,
        text: errors.join('\n\r')
    };
    errors = [];
    try {
        const info = await transport.sendMail(mailOptions);
        console.info(' email result', info, ' email result end ');
    }
    catch (e) {
        console.warn(' transport.sendMail   error ', e);
    }
}
let timeout;
const sendError = function (error) {
    errors.push(error);
    clearTimeout(timeout);
    timeout = setTimeout(sendErrorEmail, 60000);
    if (errors.length > 200)
        sendErrorEmail();
};
function appendString(message1, message2, filename) {
    message1 = ' \n\r ' + new Date().toISOString() + ' \n\r ' + message1 + message2;
    fs.appendFile(filename, message1, 'utf8', (err) => {
        console.log(filename + '  ' + message1 + '   append: ' + err);
    });
}
function toString(obj) {
    if (typeof obj === 'string')
        return obj;
    let out = ' to string ';
    try {
        if (obj.hasOwnProperty('code'))
            out = ' code ' + obj['code'];
        if (obj.hasOwnProperty('config'))
            out += ' config ' + obj['config']['url'];
        else
            out += JSON.stringify(obj);
    }
    catch (e) {
        out = e.toString() + ' keys ' + Object.keys(obj);
        console.log(out);
        console.log(obj);
    }
    return out;
}
function myLoggerInit(id) {
    console.error = function (v1, v2) {
        const err1 = v1 ? toString(v1) : '';
        const err2 = v2 ? toString(v2) : '';
        appendString(err1, err2, 'logs/' + id + '-errors.txt');
        sendError(err1 + ' ' + err2);
    };
    console.warn = function (v1, v2) {
        const err1 = v1 ? toString(v1) : '';
        const err2 = v2 ? toString(v2) : '';
        appendString(err1.toString(), err1.toString(), 'logs/' + id + '-warns.txt');
    };
    console.info = function (v1, v2) {
        const err1 = v1 ? toString(v1) : '';
        const err2 = v2 ? toString(v2) : '';
        appendString(err1.toString(), err2.toString(), 'logs/' + id + '-infos.txt');
    };
}
exports.myLoggerInit = myLoggerInit;
