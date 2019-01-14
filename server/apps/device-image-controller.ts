import {VODevice} from './models';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export class DeviceImageController {
  constructor(private device: VODevice, private baseUrl: string) {

    if (device.captureUrl && device.thumbFileUrl) this.downloadImages().then(() => {
      // console.log(' DOWNLOAD DONE ' + device.deviceName);
      this.destroy();
    }).catch(console.error);
  }

  async downloadImages() {
    const thumbURL = this.baseUrl + this.device.thumbFileUrl;
    const captureURL = this.baseUrl + this.device.captureUrl;
    const name = this.device.deviceName;
    //  console.log(thumbURL, captureURL);
    const filename1 = 'images/' + name + '_thumb.png';
    const filename2 = 'images/' + name + '_capture.jpg';
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
