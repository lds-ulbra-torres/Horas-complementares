import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthOwnService} from '../../services/auth/authOwn.service';
import {User} from '../../models/user';
import { ReturnStatement } from '@angular/compiler';
import {getJwt} from '../../../main';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthOwnService, User]
})
export class LoginComponent implements OnInit {

  errors: string;
  success: string;


  constructor(
    private _service : AuthOwnService,
    public user: User,
    private _route: Router,
    private socialAuthService: AuthService
  ) { }

  ngOnInit() {
    if (getJwt()) {
      this._service.info()
        .subscribe(data => {
          if(data.user){
            const response_user = JSON.parse(JSON.stringify(data.user));
            if(response_user.user_type == 1){
              this._route.navigate(['dashboard/admin']);
            }else if(response_user.user_type == 2){
              this._route.navigate(['dashboard/student']);
            }else{
              this._route.navigate(['/']);
              window.sessionStorage.clear();
              window.localStorage.removeItem('jwt');
            } 
          }else{
            this._route.navigate(['/']);
            window.sessionStorage.clear();
            window.localStorage.removeItem('jwt');
          }
        });
      }
  }

  login(){
    this._service.login(this.user)
    .then(data => {
      if(data){
        const response = JSON.parse(JSON.stringify(data));
        if(response.status == 0 || response.status == 500){
          this.errors = 'Erro interno.'
          return
        }
        if(response.status == 404){
          this.errors = 'Falha de conexão.'
          return
        }

        var body = JSON.parse(response._body);
        if(response.status >= 200 && response.status <= 205){
          window.localStorage.setItem('jwt', body._token);
          if(body.user.user_type){
            this.redirect(body.user.user_type)
          }else{
            this._route.navigate(['/'])
          }
        }else if(response.status >= 400 && response.status < 500){
          if(body.errors){
            for(var key in body.errors) {
              this.errors = body.errors[key];
              return
            }
          }
          for(var key in body) {
            this.errors = body[key];
            return
          }
        }
      }else{
        this.errors = 'Ocoreu algum erro para efetuar a autenticação.'
      }
    })
  }

  socialSignIn() {
    let socialPlatformProvider;
    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        const response = JSON.parse(JSON.stringify(userData));
        let user = {
          google_id: response.id,
          name: response.name,
          email: response.email,
          token: response.token
        }
        this._service.loginGoogle(user)
        .then(data => {
          if(data){
            const response = JSON.parse(JSON.stringify(data));
            if(response.status == 0 || response.status == 500){
              this.errors = 'Erro interno.'
              return
            }
            if(response.status == 404){
              this.errors = 'Falha de conexão.'
              return
            }
    
            var body = JSON.parse(response._body);
            if(response.status >= 200 && response.status <= 205){
              window.localStorage.setItem('jwt', body._token);
              if(body.user.user_type){
                this.redirect(body.user.user_type)
              }else{
                this._route.navigate(['/'])
              }
            }else if(response.status >= 400 && response.status < 500){
              if(body.errors){
                for(var key in body.errors) {
                  this.errors = body.errors[key];
                  return
                }
              }
              for(var key in body) {
                this.errors = body[key];
                return
              }
            }
          }else{
            this.errors = 'Ocoreu algum erro para efetuar a autenticação.'
          }
        })
      }
    );
  }

  redirect(type){
    if(type == 1){
      this._route.navigate(['dashboard/admin']);
    }else if(type == 2){
      this._route.navigate(['dashboard/student']);
    }else{
      this._route.navigate(['']);
    }
  }

}
