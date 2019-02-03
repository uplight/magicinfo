"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios_1 = require("axios");
function loadLoginPage(Cookie) {
    const url = 'http://35.182.202.246:7001/MagicInfo/login.htm?cmd=INIT';
    axios_1.default({
        url,
        method: 'GET',
        headers: {
            Cookie
        }
    }).then(result => {
        console.log('security resilt', result.data);
    }).catch(console.error);
    axios_1.default.get(url).then(response => {
        console.log(response.data);
    });
}
loadLoginPage('JSESSIONID=2676C3B4D312CAE83397B4DC77CE9D88');
