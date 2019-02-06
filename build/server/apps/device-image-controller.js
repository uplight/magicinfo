"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment");
class DeviceImageController {
    constructor(device, baseUrl, auth) {
        this.device = device;
        this.baseUrl = baseUrl;
        this.auth = auth;
        this.imagesFolder = 'images';
        if (device.captureUrl && device.thumbFileUrl)
            this.downloadImages().then(() => {
                this.destroy();
            }).catch(console.warn);
    }
    get thumb() {
        return this.device.thumbFileUrl ? 'images/all/thumb-' + this.device.deviceName + '.png' : '';
    }
    get capture() {
        return this.device.captureUrl ? 'images/all/capture-' + this.device.deviceName + '.jpg' : '';
    }
    async getFolder() {
        const now = moment().format('YY-MMM-DD').split('-');
        const year = 'y' + now[0];
        const month = now[1];
        const day = 'd' + now[2];
        const name = this.device.deviceName;
        const folders = ['../../public/images', year, month, day, name];
        const folder = path.join(__dirname, folders.join('/'));
        return new Promise((resolve, reject) => {
            fs.ensureDir(folder, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(folder);
            });
        });
    }
    async downloadImages() {
        const thumbURL = this.baseUrl + this.device.thumbFileUrl;
        const captureURL = this.baseUrl + this.device.captureUrl;
        const name = this.device.deviceName;
        let folder;
        try {
            folder = await this.getFolder();
        }
        catch (e) {
            console.error('error create folder ', e);
        }
        if (!folder) {
            console.error(' cant create folder ' + name);
            return;
        }
        const time = moment().format('HH-mm');
        const filename1 = path.join(__dirname, '../../public/' + this.thumb);
        const filename3 = path.join(folder, '/thumb-' + name + '_' + time + '.png');
        const filename2 = path.join(__dirname, '../../public/' + this.capture);
        const filename4 = path.join(folder, '/capture-' + name + '_' + time + '.jpg');
        return Promise.all([this.downloadImage(thumbURL, filename1, filename3), this.downloadImage(captureURL, filename2, filename4)]);
    }
    async downloadImage(url, path1, path2) {
        const stream = await this.auth.getStream(url);
        const writer = fs.createWriteStream(path1);
        stream.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', function () {
                setTimeout(() => {
                    const stats = fs.statSync(path1);
                    const fileSizeInBytes = stats.size;
                    if (fileSizeInBytes) {
                        fs.copy(path1, path2)
                            .then(() => {
                            resolve();
                        }).catch(reject);
                    }
                    else
                        reject(' file zero ' + path1);
                }, 250);
            });
            writer.on('error', reject);
        });
    }
    destroy() {
        this.device = null;
        this.auth = null;
    }
}
exports.DeviceImageController = DeviceImageController;
