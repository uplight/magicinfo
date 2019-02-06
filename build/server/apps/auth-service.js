"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
class AuthService {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    async getConfig() {
        if (this.config)
            return Promise.resolve(this.config);
        this.config = await this.loadConfig();
        this.baseURL = this.config.baseURL;
        return this.config;
    }
    async getStream(url) {
        const response = await axios_1.default({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                Cookie: this.config.Cookie
            }
        });
        return response;
    }
    async loadConfig() {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/config.json', function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(JSON.parse(data.toString()));
            });
        });
    }
    async login() {
        const username = this.username;
        const password = this.password;
        const config = await this.getConfig();
        const uri = this.baseURL + '/auth';
        return axios_1.default.post(uri, { username, password }, { responseType: 'json' })
            .then(res => {
            this.api_key = res.data.token;
            if (this.api_key)
                return 'loggedin';
            throw new Error('login result ' + String(res.data));
        });
    }
    getApiKey() {
        return this.api_key;
    }
    async get(url, params) {
        url = this.baseURL + url;
        const api_key = this.api_key;
        if (!api_key)
            throw new Error('need api key');
        return axios_1.default.get(url, {
            params,
            headers: {
                api_key,
                'User-Agent': 'request'
            }
        }).then(result => {
            return result.data;
        });
    }
}
exports.AuthService = AuthService;
