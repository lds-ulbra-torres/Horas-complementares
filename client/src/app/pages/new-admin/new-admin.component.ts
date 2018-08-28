import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthOwnService} from '../../services/auth/authOwn.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.css'],
  providers: [AuthOwnService, User]
})
export class NewAdminComponent implements OnInit {
  errors: string;
  sucess: string;

  private token;

  constructor(
    public user: User,
    private _service: AuthOwnService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.token = params.token;
      window.localStorage.setItem('jwt', params.token);
    });
    this._service.info(this.token)
    .subscribe(data =>{
      if(data.user){
        this.user = data.user;
      }
    }, error => {
      this.errors = 'Ocorreu algum erro. Entre em contato com o administrador e solicite para enviar um novo E-mail';
    })
  }

  completeRegister(){
    this._service.createAdmin(this.user).then(data => {
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
          this._route.navigate(['dashboard/admin'])
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
        this.errors = 'Ocoreu algum erro para completar o cadastro.'
      }
    })
  }
}
