import {AuthService} from './auth-service';
import {DeviceImageController} from './device-image-controller';
import * as fs from 'fs-extra';
import * as moment from 'moment';
import * as path from 'path';

export class AllDevicesController {
  private config: any;

  devicesCtrs: DeviceImageController[];
  private auth: AuthService;

  constructor(private username: string, private password: string) {
    this.auth = new AuthService();
    this.auth.getConfig().then(config => {
      //  console.log(config);
      this.auth.login(username, password).then((login) => {
        console.log(login);
        if (login === 'loggedin') this.start();
        else console.error('login ' + login);
      }).catch(err => {
        console.error('this.auth.login', err);
      });
    }).catch(err => {
      console.error(' getConfig ', err);
    });
  }

  start() {
    this.tick();
    setInterval(() => this.tick(), 65 * 1000);
  }


  async tick() {
    let devices: any[];
    try {
      devices = await this.getDevices();
    } catch (e) {

      this.auth.login(this.username, this.password).then(loggedin => {
        console.info(' re login ' + loggedin);
        if (loggedin === 'loggedin') this.tick();
      });
      console.info(' getDevices() ', e.toString());
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
