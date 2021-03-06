import axios from 'axios';
import * as fs from 'fs';

export class AuthService {
  // salt = 'my salt';
  config: any;
  api_key: string;
  baseURL: string;

  constructor(private username: string, private password: string) {

  }

  async getConfig() {
    if (this.config) return Promise.resolve(this.config);
    this.config = await this.loadConfig();
    this.baseURL = this.config.baseURL;
    return this.config;

  }

  async getStream(url: string) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        // api_key,
        Cookie: this.config.Cookie
      }
    });
    return response;
  }

  private async loadConfig() {
    return new Promise((resolve, reject) => {
      fs.readFile(__dirname + '/config.json', function (err, data) {
        if (err) reject(err);
        else resolve(JSON.parse(data.toString()));
      });
    });
  }

  async login() {
    const username = this.username;
    const password = this.password;
    const config = await this.getConfig();
    const uri = this.baseURL + '/auth';

    // console.log(' call login');

    return axios.post(uri, {username, password}, {responseType: 'json'})
      .then(res => {
        this.api_key = res.data.token;
        if (this.api_key) return 'loggedin';
        throw new Error('login result ' + String(res.data));
      });
  }

  getApiKey() {
    return this.api_key;
  }

  async get(url: string, params: any) {
    url = this.baseURL + url;
    const api_key = this.api_key;
    if (!api_key) throw new Error('need api key');
    return axios.get(url,
      {
        params,
        headers: {
          api_key,
          'User-Agent': 'request'
        }
      }
    ).then(result => {
      //  console.log(result);
      return result.data;
    });
  }

  /*async get2(url: string, params: any) {
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
      //   request(options, callback);
    });
  }*/
}
