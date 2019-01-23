import {VODevice} from './models';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import * as moment from 'moment';
import {createAttribute} from '@angular/compiler/src/core';

export class DeviceImageController {
  constructor(private device: VODevice, private baseUrl: string) {

    if (device.captureUrl && device.thumbFileUrl) this.downloadImages().then(() => {
      // console.log(' DOWNLOAD DONE ' + device.deviceName);
      this.destroy();
    }).catch(console.error);
  }

  async getFolder(): Promise<string> {
    const now: string[] = moment().format('YY-MMM-DD').split('-');
    const year = 'y' + now[0];
    const month = now[1];
    const day = 'd' + now[2];
    const name = this.device.deviceName;
    const folders = ['./images', year, month, day, name];
    const folder = folders.join('/');
    return new Promise<string>((resolve, reject) => {
      fs.ensureDir(folder, (err) => {
        if (err) reject(err);
        else resolve(folder);
      });
    });
  }

  async downloadImages() {
    const thumbURL = this.baseUrl + this.device.thumbFileUrl;
    const captureURL = this.baseUrl + this.device.captureUrl;
    const name = this.device.deviceName;
    let folder: string;
    try {
      folder = await this.getFolder();
    } catch (e) {
      console.error('create folder ', e);
    }

    if (!folder) return;

    const time = moment().format('HH-mm');

    const filename1 = folder + '/thumb-' + time + '.png';
    const filename2 = folder + '/capture-' + time + '.jpg';
    return Promise.all([this.downloadImage(thumbURL, filename1), this.downloadImage(thumbURL, filename2)]);
  }

  async downloadImage(url: string, filename: string) {

    const path1 = filename; // path.resolve(__dirname, 'images', 'code.jpg');

    const writer = fs.createWriteStream(path1);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    //  console.log('downloading ' + url + '   ' + filename);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  destroy() {
    this.device = null;
  }
}
