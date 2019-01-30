import {VODevice} from './models';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import * as moment from 'moment';
import {AuthService} from './auth-service';

export class DeviceImageController {

  imagesFolder = 'images';

  constructor(private device: VODevice, private baseUrl: string, private auth: AuthService) {

    if (device.captureUrl && device.thumbFileUrl) this.downloadImages().then(() => {
      // console.log(' DOWNLOAD DONE ' + device.deviceName);
      this.destroy();
    }).catch(console.warn);
  }

  get thumb() {
    return this.device.thumbFileUrl ?  'images/all/thumb-' + this.device.deviceName + '.png' : '';
  }

  get capture() {
    return this.device.captureUrl ? 'images/all/capture-' + this.device.deviceName + '.jpg' : '';
  }

  async getFolder(): Promise<string> {
    const now: string[] = moment().format('YY-MMM-DD').split('-');
    const year = 'y' + now[0];
    const month = now[1];
    const day = 'd' + now[2];
    const name = this.device.deviceName;
    const folders = ['../../public/images', year, month, day, name];
    const folder = path.join(__dirname, folders.join('/'));
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
      console.error('error create folder ', e);
    }

    //  await fs.emptyDir(imagesFolder);
    if (!folder) {
      console.error(' cant create folder ' + name);
      return;
    }
    const time = moment().format('HH-mm');

    const filename1 = path.join(__dirname, '../../public/' + this.thumb);
   // console.log(filename1);
    const filename3 = path.join(folder, '/thumb-' + name + '_' + time + '.png');


    const filename2 = path.join(__dirname, '../../public/' + this.capture);
    const filename4 = path.join(folder, '/capture-' + name + '_' + time + '.jpg');

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
