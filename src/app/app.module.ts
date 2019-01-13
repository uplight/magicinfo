import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {ApisModule} from './apis/apis.module';
import { DeviceThumbComponent } from './device-thumb/device-thumb.component';
import {MyMaterialModule} from './my-material/my-material.module';

import { LoginComponent } from './login/login.component';
import {FormsModule} from '@angular/forms';
import {AppServicesModule} from './app-services/app-services.module';
import {AuthService} from './apis/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    DeviceThumbComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ApisModule,
    AppServicesModule,
    MyMaterialModule
  ],
  providers: [
    AuthService,
    { provide: APP_INITIALIZER, useFactory: startupProviderFactory, deps: [AuthService], multi: true }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


export function startupProviderFactory(provider: AuthService) {
  return () => provider.loadConfig();
}
