import { Component, OnInit } from '@angular/core';
import {AuthService} from '../apis/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string;
  baseURL: string;
  username: string;
  password: string;
  constructor(
    private service:AuthService
  ) { }

  ngOnInit(){
    this.baseURL = this.service.baseURL;

  }
  onSubmitClick(){
    this.errorMessage = '';
    this.service.login(this.baseURL, this.username, this.password).catch(err =>{
      this.errorMessage = 'ERROR ' + err.message;
    }).then(res =>{
      this.errorMessage = String(res);
    })

  }

}
