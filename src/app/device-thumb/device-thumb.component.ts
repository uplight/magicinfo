import {Component, Input, OnInit} from '@angular/core';

import * as moment from 'moment';
import {AuthService} from '../apis/auth.service';

@Component({
  selector: 'app-device-thumb',
  templateUrl: './device-thumb.component.html',
  styleUrls: ['./device-thumb.component.css']
})
export class DeviceThumbComponent implements OnInit {
  @Input() device: any;

  deviceProps: { label: string, data: string }[];
  imageURL: string;

  myLocation: string;
  capturedDate: string;
  constructor(
    private userService: AuthService
  ) {
  }

  ngOnInit() {
    if (!this.device) return;
    const out = [];
    for (let str in this.device) {
      out.push({
        label: str.split('_').join(' '),
        data: this.device[str].split('_').join(' ')
      });
    }

    this.myLocation = this.device.location;
   //  this.capturedDate = moment(this.device.captured_date).format('HH:mm');
    //this.deviceProps = out;
    this.getThumbnail();
  }

  getThumbnail(){
    /*this.userService.getDeviceThumbnail(this.device.device_id).subscribe(res => {
      this.imageURL = res;
    });
    setTimeout(()=> this.getThumbnail(), 10000);*/
  }

}
