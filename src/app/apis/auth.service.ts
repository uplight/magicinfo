import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as querystring from 'querystring';

import {map} from 'rxjs/operators';
import {Observable, Subscriber} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  config: any;
  token: string;

  baseURL: string;
  httpOptions: any;

  // private URL = 'http://localhost:8989';
  constructor(
    private http: HttpClient
  ) {

    this.baseURL = localStorage.getItem('baseURL');
    const token = localStorage.getItem('token');
    this.token = token;
    if (token) {
      this.httpOptions = {
        headers: new HttpHeaders({
          api_key: token
        })
      };
    }
  }


  login(baseUrl: string, username: string, password: string) {
    this.baseURL = baseUrl;
    localStorage.setItem('baseURL', baseUrl);
    const url = this.baseURL + '/auth';
    return this.http.post(url, {
      username: username,
      password: password // 'zM0vdNZcyfb11u7YQoQd'
    }).toPromise().then((res: any) => {
      const token = res.token;
      this.token = token;
      localStorage.setItem('token', token);
      this.httpOptions = {
        headers: new HttpHeaders({
          api_key: token
        })
      };
      return 'Loggged IN';
    });
  }

  async loadConfig() {
    return this.http.get('assets/config.json').toPromise().then((res: any) => {
      this.config = res;
      return res;
    });
  }

  async getConfig() {
    if (this.config) return Promise.resolve(this.config);
    return this.loadConfig();
  }

  async get(url: string, data: any) {
    const options = this.httpOptions;
    if (!options) throw new Error(' token reqired');
    options.params = data;
   //  console.log(options);
    return this.http.get(this.baseURL + url, options).toPromise().catch(err => {
      console.error(err);
    });
  }


  getImage(url: string): Observable<any> {
    const token = this.token;
   //  console.log(token);
    const headers = this.getHeaders();




    return new Observable((observer: Subscriber<any>) => {
     //  let objectUrl: string = null;


     //  console.log(headers);
      this.http
        .get(url, {
          headers,
          responseType: 'blob'
        })
        .subscribe(m => {
          // console.log(m);
         // objectUrl = URL.createObjectURL(m);
         // observer.next(objectUrl);
        });

     /* return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };*/
    });
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      cookie: 'JSESSIONID=63E6C34C33E3CF724F64D157C2A1E7BA; magicInfoUserId=; MagicInfoPremiumLanguage=en;'
      + 'org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en; devicePageSizeAEBAdmin=30'
    });
  }

  /* loadIndex() {
     const url = 'MagicInfo/login.htm?cmd=INIT';
     this.http.get(url, {responseType: 'text', observe: 'response'}).subscribe(res => {
       console.log(res.headers);

       this.login().subscribe(res2 => {
         console.log(res2);
       });
     });
   }*/
  /*
    getPaylod(data) {
      data.token = this.token;
      return querystring.stringify(data);
    }*/

  /*getHeaders() {
    return new HttpHeaders({
      'x-csrf-token': this.csrf,
      'x-cookie': this.session,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }*/

  /* sendXMLPost(data) {
     return this.http.post('/api/proxy/' + this.openapiurl, this.getPaylod(data), {
       headers: this.getHeaders(),
       responseType: 'text'
     });
   }*/

  /* getDeviceThumbnail(deviceId: string) {
     const payload = {
       service: 'PremiumDeviceService.getDeviceThumbnailURL',
       device_id: deviceId
     };
     return this.sendXMLPost(payload).pipe(map((res: any) => {
       const json = this.xmlTextToJson(res);
       return json.response.responseClass['#text'];

     }));
   }*/

  /*  getDeviceThumbnail1(deviceId: string){
      return this.http.get(this.URL + '/api/getDeviceThumbnailURL/' + deviceId).pipe(map((res: any) =>{
        //console.log(res)
        return res.data;

      }))
    }*/

  getDevices2() {
    const url = '/restapi/v1.0/rms/devices';
    const params = this.config.queryParams['devices'];
    return this.get(url, params).then((res: any) => {
      res.serverURL = this.baseURL;
      return res;
    });
  }

  /*getDevices() {
    let payload = {
      service: 'PremiumDeviceService.getDeviceListWithDeviceType',
      condition: '<DeviceCondition><statusViewMode>device_status_view_all</statusViewMode></DeviceCondition>',
      deviceType: 'ALL'
    };
    return this.sendXMLPost(payload).pipe(map((res: any) => {
      // console.log(res);
      const json = this.xmlTextToJson(res);
      return json.response.responseClass.resultList.Device.map(function (item) {
        const out: any = {};
        for (let str in item) {
          out[str] = item[str]['#text'] || item[str]['#cdata-section'];
        }
        return out;
      });
    }));
  }*/

  /* getDevicesOld() {
     return this.http.get(this.URL + '/api/getDevices/-1').pipe(map((res: any) =>{
       return res.devices.map(function (item) {
         const out: any ={};
          for (let str in item) {

            item[str] = item[str].toString();
          }
         return item;
       });

     }))
      /!* .done(function (res) {

       //devices_arr = res;
       console.log('getAllDevices ', res);
       let devices = res.devices;
       devices.forEach(function (item, i, arr) {
 //                        var Device = new magic.MyDevice(item);
         // console.log('Device ', Device.deviceConnection);
         var myMarker = new CustomMarker(
           new google.maps.LatLng(devicesAr[i].Lat, devicesAr[i].Lng),
           map,
           {
             marker_id: 'myMarker',
             color: 'red'
           },
           item
         );
         google.maps.event.addListener(myMarker, 'click', function () {
           console.log('arg', arguments);
 //                        map.setCenter(RdrMarker.getPosition());
 //                        infowindow.setContent(contentStringRdr);
 //                        infowindow.open(map,RdrMarker);
         });
 //                        Device.createDeviceBlock(positions[i]);
       });
       promise.resolve(devices);

     }).fail(function (error) {
       promise.reject(error);
       console.error('error', error);
     });*!/

    // return promise
   }
 */
  setModalThumb(par?: any) {
    /* $.get('/api/getDeviceThumbnailURL/' + this.deviceId).done((res) => {
       // console.log('res', res);
       this.thumbDevice = res.substr(0, res.length - 11);
       // console.log('this.thumbDevice', this.thumbDevice);
       // this.$imgThumb.css(
       //   "background-image", "url(" + "'" + this.thumbDevice + "'" + ")"
       // );
     }).fail(this.onError);*/

  }


  setModalDevicePlayingContentInfo() {
    /*  $.get('/api/getDevicePlayingContent/' + this.deviceId).done((res) => {
        console.log('res', res);
        for (let key in res.data) {
          if (key == '$') continue;
          if (key == 'contentLists') {
            let contentLists = res.data[key][0].ContentList[0];
            for (let key in contentLists) {
              this.$contentSelect.append($('<option>').text(key + ': ' + contentLists[key][0]));
              // this.$contentInfoModal.append($('<p>').text(key + ': ' + contentLists[key][0]));
            }
            continue;
          }
          this.$contentSelect.append($('<option>').text(key + ': ' + res.data[key][0]));
          // console.log('key', key);
          // console.log('key[0]', this.device[key][0]);
        }
        // console.log('ContentInfo', res);
      }).fail((err) => {
        console.error('error', err);
        return err;
      });*/
  }

  setModalPlayingContentInfo() {
    /*  $.get('/api/getPlayingContentInfo/' + this.deviceId).done((res) => {
        // console.log('res', res);
        let contentInfo;
        if (res['content_id'][0] != this.content_id) {
          this.$contentSelect.empty();
          this.content_id = res['content_id'][0];
          for (let key in res) {
            if (key == '$') continue;
            contentInfo = {contentKey: key, contentVal: res[key][0]};
            // this.$contentSelect.append($('<option>').text(key + ': ' + res[key][0]));
            // console.log('key', key);
            // console.log('key[0]', this.device[key][0]);
          }
        }
        this.playingContentInfo.render(contentInfo);
        // console.log('ContentInfo', res);
      }).fail((err) => {
        console.error('error', err);
        return err;
      });*/
  }


  /*getInfo() {
    const url = 'http://tgag.magicinfo.net:7001/MagicInfo/layout/common.htm?cmd=getUserInfo';
    let headers = new HttpHeaders();
    headers = headers.set('cookie',
      'JSESSIONID=CD2A8B3CFD884EA96AC06A3121F6BABD; magicInfoUserId=; MagicInfoPremiumLanguage=en;
      org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en');
    return this.http.get(url, {headers: headers});
  }*/


  xmlTextToJson(data) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    return this.xmlToJson(xmlDoc);
  }


  xmlToJson(xml): string | any {
    // Create the return object

    const obj: any = {};
    if (xml.nodeType === 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // text
      const str = xml.nodeValue.trim();
      if (str.length) return str;
    } else if (xml.nodeType === 4) {
      return xml.data;
    }
    // do children
    if (xml.hasChildNodes()) {
      for (let i = 0, n = xml.childNodes.length; i < n; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        if (typeof(obj[nodeName]) === 'undefined') {
          const out = this.xmlToJson(item);
          if (Object.keys(out).length) obj[nodeName] = out;
        } else {
          const out2 = this.xmlToJson(item);
          if (Object.keys(out2).length === 0) continue;
          if (typeof(obj[nodeName].push) === 'undefined') obj[nodeName] = [obj[nodeName], out2];
          else obj[nodeName].push(out2);

        }
      }
    }
    return obj;
  }
}
