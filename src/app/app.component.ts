import {Component, OnInit} from '@angular/core';

import * as moment from 'moment';
import * as _ from 'lodash';
import {MyDevicesService} from './app-services/my-devices.service';
import {AuthService} from './apis/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  currentTime: string;
  devices: any[];
  needLogin: boolean;
  constructor(
    private devicesService: MyDevicesService
  ) {
  }

  ngOnInit() {
    this.devicesService.start();
    this.devicesService.devices$().subscribe(res => {
     // console.log(res);
      this.devices = res
    });
  }
  onNeedLoginClick() {
    this.needLogin = !this.needLogin;
  }
}