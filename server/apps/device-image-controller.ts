import {VODevice} from './models';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import * as moment from 'moment';
import {AuthService} from './auth-service';

export class DeviceImageController {

  imagesFolder = './server/public/images/all';

  constructor(private device: VODevice, private baseUrl: string, private auth: AuthService) {

    if (device.captureUrl && device.thumbFileUrl) this.downloadImages().then(() => {
      // console.log(' DOWNLOAD DONE ' + device.deviceName);
      this.destroy();
    }).catch(console.warn);
  }

  get thumb() {
    return this.device.thumbFileUrl ? this.imagesFolder + '/thumb-' + this.device.deviceName + '.png' : '';
  }

  get capture() {
    return this.device.captureUrl ? this.imagesFolder + '/capture-' + this.device.deviceName + '.jpg' : '';
  }

  async getFolder(): Promise<string> {
    const now: string[] = moment().format('YY-MMM-DD').split('-');
    const year = 'y' + now[0];
    const month = now[1];
    const day = 'd' + now[2];
    const name = this.device.deviceName;
    const folders = ['./server/public/images', year, month, day, name];
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

    //  await fs.emptyDir(imagesFolder);
    if (!folder) {
      console.error(' cant create folder ' + name);
      return;
    }
    const time = moment().format('HH-mm');

    const filename1 = this.thumb;
    const filename3 = folder + '/thumb-' + name + time + '.png';

    const filename2 = this.capture;
    const filename4 = folder + '/capture-' + name + time + '.jpg';

    // const stream1 = await this.auth.getStream(captureURL);
    // const stream2 = await this.auth.getStream(thumbURL);


    // console.log(thumbURL);

    return Promise.all([this.downloadImage(thumbURL, filename1, filename3), this.downloadImage(captureURL, filename2, filename4)]);
  }

  async downloadImage(url: string, path1: string, path2: string) {

    const stream = await this.auth.getStream(url);
    //  const path1 = filename; // path.resolve(__dirname, 'images', 'code.jpg');

    const writer = fs.createWriteStream(path1);

    stream.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', function () {
        //  console.log(path1, path2);
        // resolve();
        setTimeout(() => {
          const stats = fs.statSync(path1);
          const fileSizeInBytes = stats.size;
          //  console.log(fileSizeInBytes);
          if (fileSizeInBytes) {
            fs.copy(path1, path2)
              .then(() => {
                resolve();
              }).catch(reject);
          } else reject(' file zero ' + path1);

        }, 50);

      });
      writer.on('error', reject);

    });
  }

  destroy() {
    this.device = null;
    this.auth = null;
  }
}
