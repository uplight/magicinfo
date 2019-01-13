import {Injectable} from '@angular/core';
import {AuthService} from '../apis/auth.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import {BehaviorSubject, Subject} from 'rxjs';
import {skip} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyDevicesService {
  _devices: any[];

  private devicesSub: BehaviorSubject<any[]> = new BehaviorSubject([]);

  placesholder = '/assets/no-image.jpg';
  serverURL: string;

  constructor(
    private userService: AuthService
  ) {
  }

  devices$() {
    return this.devicesSub.asObservable().pipe(skip(1));
  }

  start() {
    this.loadDevices2();
    setInterval(() => {
      this.loadDevices2();
    }, 10000);

  }

  getImageURL(url: string) {
    if (!url) return '/assets/off.jpg';
    return url.indexOf('servlet') === -1 ? this.placesholder : this.userService.baseURL + url;
  }

  loadDevices2() {
    this.userService.getDevices2().then((res: any) => {
      //  console.log(res);
      this.serverURL = res.serverURL;
      const devices = res.items;
      const devicesIndexed = _.keyBy(devices, 'deviceId');
      const baseURL = this.userService.baseURL;

      if (!this._devices) this._devices = devices.map((item) => {
        return {
          deviceId: item.deviceId,
          label: item.deviceName.split('_').join(' '),
          thumb: this.getImageURL(item.captureUrl),
          image: this.getImageURL(item.thumbFileUrl),
          date: this.imageTodate(item.captureUrl)
        };
      });
      else {
        this._devices.forEach((item) => {
          const newValue = devicesIndexed[item.deviceId];
          if (!newValue) console.error(' no device ', newValue);
          item.date = this.imageTodate(newValue.captureUrl);
          item.thumb = this.getImageURL(newValue.captureUrl);
          item.image = this.getImageURL(newValue.thumbFileUrl);
        });
        console.log(devicesIndexed);
      }

      this.devicesSub.next(this._devices);
    });
  }

  imageTodate(url: string) {
    if (!url) return '';
    const index = url.lastIndexOf('&');
    return moment(+url.substr(index + 1)).format('MM-DD h:mm:ss a');
  }


  async getDevices2() {
    const url = '/restapi/v1.0/rms/devices';
    const config = await this.userService.getConfig();
    const params = config.queryParams['devices'];

    return this.userService.get(url, params).then((res: any) => {
      res.serverURL = this.userService.baseURL;
      return res;
    });
  }
}
