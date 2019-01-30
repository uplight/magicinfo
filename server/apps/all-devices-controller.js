"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("./auth-service");
const device_image_controller_1 = require("./device-image-controller");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");
class AllDevicesController {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.auth = new auth_service_1.AuthService();
        this.auth.getConfig().then(config => {
            this.auth.login(username, password).then((login) => {
                console.log(login);
                if (login === 'loggedin')
                    this.start();
                else
                    console.error('login ' + login);
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
        let devices;
        try {
            devices = await this.getDevices();
        }
        catch (e) {
            this.auth.login(this.username, this.password).then(loggedin => {
                console.info(' re login ' + loggedin);
                if (loggedin === 'loggedin')
                    this.tick();
            });
            console.error(' getDevices() ', e.toString());
        }
        if (Array.isArray(devices)) {
            console.log(' total devices ' + devices.length);
            const baseUrl = this.auth.baseURL;
            const out = [];
            const auth = this.auth;
            devices.forEach(function (item) {
                const ctr = new device_image_controller_1.DeviceImageController(item, baseUrl, auth);
                item.capture = ctr.capture.replace('./public/', '');
                item.thumb = ctr.thumb.replace('./public/', '');
                out.push(ctr);
            });
            this.devicesCtrs = out;
            const timestamp = moment().format();
            fs.writeJSON(path.join(__dirname, '../../public/images/devicesList.json'), { timestamp, devices })
                .catch(console.error);
        }
        else
            console.error(' getDevices not Array ', devices);
    }
    async getDevices() {
        const url = '/restapi/v1.0/rms/devices';
        const params = { startIndex: 0, pageSize: 200 };
        return this.auth.get(url, params).then(result => {
            return result.items;
        });
    }
}
exports.AllDevicesController = AllDevicesController;
