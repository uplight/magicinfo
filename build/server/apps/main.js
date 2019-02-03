"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const my_logger_1 = require("../com/my-logger");
const all_devices_controller_1 = require("./all-devices-controller");
const config = require('./config.json');
my_logger_1.myLoggerInit('magic-info');
const ar = config.secret.split('.');
const deviceController = new all_devices_controller_1.AllDevicesController(ar[0], ar[1]);
