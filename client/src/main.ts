import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));


export const API_URL = 'http://177.101.200.35/certificados-api/api/';  
export const APP_KEY = 'base64:7e5rV9ZfeAz55LKbaVKyq5ljsiK7qBqh/6lgu1Rs+Gk=';


export function getJwt() {
  if (localStorage.getItem('jwt') && localStorage.getItem('jwt') != ' ') {
    return localStorage.getItem('jwt')
  }else{
    return false;
  }
}