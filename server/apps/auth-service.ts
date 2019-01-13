import * as request from 'request';
import {HttpHeaders} from '@angular/common/http';
import * as fs from 'fs';

export class AuthService {
  salt = 'my salt';
  config: any;
  api_key: string;
  baseURL: string;


  async getConfig() {
    if (this.config) return Promise.resolve(this.config);
    this.config = await this.loadConfig();
    this.baseURL = this.config.baseURL;
    return this.config;

  }

  private async loadConfig() {
    return new Promise((resolve, reject) => {
      fs.readFile(__dirname + '/config.json', function (err, data) {
         console.log('loaded', data.toString());
        if (err) reject(err);
        else resolve(JSON.parse(data.toString()));
      });
    });
  }

  async login() {
    const config = await this.getConfig();
    const ar = config.secret.split('.');
    const username = ar[0];
    const password = ar[1];
    const uri = this.baseURL + '/auth';
    return new Promise((resolve, reject) => {

      const options = {
        uri,
        method: 'POST',
        // contentType: 'application/json',
        json: {username, password}
      };
     //  console.log(options);
      request(options, (e, r, res) => {
      //  console.log(typeof res);
        if (e) {
          reject(e);
          return;
        }
        if (typeof res !== 'object') {
          reject(res);
          return;
        }
        if ( !res.token) {
          reject(res);
          return;
        }
        const token = res.token;
        this.api_key = token;
       // console.log(token);
        if (token) resolve('loggedin');
        else request(e);

      });
    });
  }

  async get(url: string, params: any) {
    url = this.baseURL + url;
    const api_key = this.api_key;
    if (!api_key) throw new Error('need api key');
    return new Promise<any>((resolve, reject) => {

      const options = {
        url,
        qs: params,
        headers: {
          api_key,
          'User-Agent': 'request',
          'Accept': 'application/json'
        }
      };
      const callback = function (e, r, res) {
       // console.log(typeof res);
        if (e) {
          reject(e);
          return;
        }
        let result: any;
        try {
          result = JSON.parse(res);
        } catch (er) {
          reject(er);
        }
      //  console.log(result);
        if (result) resolve(result);
        else reject(res);

      };
     //  console.log(options);
      request(options, callback);
    });
  }
}
