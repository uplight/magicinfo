import {VODevice} from './models';
import * as fs from 'fs';
import * as request from 'request';

export class DeviceImageController {
  constructor(private device: VODevice, private baseUrl: string) {

    if (device.captureUrl && device.thumbFileUrl) this.downloadImages().then(() => {
      this.destroy();
    }).catch(console.error);
  }

  downloadImages() {
    const thumbURL = this.baseUrl + this.device.thumbFileUrl;
    const captureURL = this.baseUrl + this.device.captureUrl;
    const name = this.device.deviceName;
    //  console.log(thumbURL, captureURL);

    const download = function (uri, filename, callback) {
      console.log(' download ' + uri, filename);
      request.head(uri, function (err, res, body) {
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback).on('error', callback);
      });
    };
    return new Promise((resolve, reject) => {
      download(thumbURL, 'images/' + name + '_thumb.png', function (e) {
        if (e) console.error(e);
        console.log('DONE ', e);
        download(captureURL, 'images/' + name + '_capture.jpg', function (e1) {
          console.log('DONE', e1);
          if (e1) console.error(e1);
          resolve();
        });
      });
    });
  }

  destroy() {
    this.device = null;
  }
}
