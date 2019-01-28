import {Component, Input, OnInit} from '@angular/core';

import * as moment from 'moment';
import {AuthService} from '../apis/auth.service';
import {VODevice} from '../models/app-models';

@Component({
  selector: 'app-device-thumb',
  templateUrl: './device-thumb.component.html',
  styleUrls: ['./device-thumb.component.css']
})

export class DeviceThumbComponent implements OnInit {
  @Input() device: VODevice;

  placesholder = '/assets/no-image.jpg';
 //  deviceProps: { label: string, data: string }[];
 // imageURL: string;

  capture;
  thumbnail;

  myName: string;
  myDate: string;
 //  capturedDate: string;

  constructor(
    private userService: AuthService
  ) {
  }

  ngOnInit() {
    if (!this.device) {
      return;
    }
    const out = [];

   /* for (const str in this.device) {
      out.push({
        label: str.split('_').join(' '),
        data: this.device[str].split('_').join(' ')
      });
    }*/

    //  this.myLocation = this.device.location;
    const thumb = this.device.capture || this.placesholder;
    const capture = this.device.thumb || this.placesholder;
    // console.log(capture);

    this.myName = this.device.deviceName.split('_').join(' ');
    this.capture = capture;
    this.thumbnail = thumb;
  //   console.log(thumb);
  /* this.userService.getImage(thumb).subscribe(res => {
      console.log(res);
    });*/

    // this.capturedDate = moment(this.device.captured_date).format('HH:mm');
    // this.deviceProps = out;
    this.getThumbnail();
  }

  getThumbnail() {


    /*this.userService.getDeviceThumbnail(this.device.device_id).subscribe(res => {
      this.imageURL = res;
    });
    setTimeout(()=> this.getThumbnail(), 10000);*/
  }

}
