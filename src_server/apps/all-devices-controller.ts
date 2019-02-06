import {AuthService} from './auth-service';
import {DeviceImageController} from './device-image-controller';
import * as fs from 'fs-extra';
import * as moment from 'moment';
import * as path from 'path';

export class AllDevicesController {
  private config: any;

  devicesCtrs: DeviceImageController[];
  private auth: AuthService;

  constructor(username: string, password: string) {
    this.auth = new AuthService(username, password);
    this.start();
  }

  async login() {
    let login;
    try {
      login = await this.auth.login();
    } catch (e) {
      console.error(' cant login ' + JSON.stringify(e));
    }

    return login;
  }

  async start() {
    console.log(' start ');
    const login = await this.login();
   console.log('login ', login);
    if (login) {
      this.tick();
      setInterval(() => this.tick(), 65 * 1000);
    }

  }

  async tick() {
    let devices: any[];
    try {
      devices = await this.getDevices();
    } catch (e) {
      console.warn(' error devices ' + JSON.stringify(e));
      const login = await this.login();
      if (login) this.tick();
      return;
    }


    if (Array.isArray(devices)) {
      console.log(' total devices ' + devices.length);
      const baseUrl = this.auth.baseURL;
      const out: DeviceImageController[] = [];
      const auth = this.auth;
      devices.forEach(function (item) {
        const ctr = new DeviceImageController(item, baseUrl, auth);
        item.capture = ctr.capture.replace('./public/', '');
        item.thumb = ctr.thumb.replace('./public/', '');
        out.push(ctr);
      });
      this.devicesCtrs = out;
      const timestamp = moment().format();

      fs.writeJSON(path.join(__dirname, '../../public/images/devicesList.json'), {timestamp, devices})
        .catch(console.error);
    } else console.error(' getDevices not Array ', devices);

  }

  async getDevices() {
    const url = '/restapi/v1.0/rms/devices';
    const params = {startIndex: 0, pageSize: 200};
    return this.auth.get(url, params).then(result => {
      return result.items;
    });
  }
}
