import {myLoggerInit} from '../com/my-logger';
import {AllDevicesController} from './all-devices-controller';
const  config = require('./config.json');


myLoggerInit('magic-info');

const ar = config.secret.split('.');
 const deviceController = new AllDevicesController(ar[0], ar[1]);

