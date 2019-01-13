import {AuthService} from './auth-service';
import {DeviceImageController} from './device-image-controller';

export class AllDevicesController {
  private config: any;

  devicesCtrs: DeviceImageController[];
  private auth: AuthService;

  constructor() {

    this.auth = new AuthService();
    this.auth.getConfig().then(config => {
      //  console.log(config);
      this.auth.login().then((login) => {
        console.log('login ', login);
        if (login === 'loggedin') this.start();
        else console.error(login);
      }).catch(console.error);
    });
  }

  start() {
    this.tick();

  }


  async tick() {
    let devices: any[];
    try {
      devices = await this.getDevices();
    } catch (e) {
      console.error(e);
    }

    if (Array.isArray(devices)) {
      const baseUrl = this.auth.baseURL;
      const out: DeviceImageController[] = [];
      devices.forEach(function (item) {
        out.push(new DeviceImageController(item, baseUrl));
      });
      this.devicesCtrs = out;
    } else console.error(devices);

  }

  async getDevices() {
    const url = '/restapi/v1.0/rms/devices';
    const params = {startIndex: 0, pageSize: 100};
    return this.auth.get(url, params).then(result => {
      return result.items;
    });
  }
}
