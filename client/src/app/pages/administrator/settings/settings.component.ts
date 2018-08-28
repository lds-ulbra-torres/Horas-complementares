import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../services/administrator/administrator.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

export class Email{
  id: string;
  email: string;
}
export class Admin{
  email: string;
  google: boolean
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [AdministratorService, Email, Admin]
})
export class SettingsComponent implements OnInit {
  errors_modal: string;
  success_modal: string;
  success: string;
  errors: string;

  modalRef: BsModalRef;

  modelName;
  modelId;

  config = {
    class: 'modal-pg'
  }
  emails = [];

  constructor(
    public email: Email,
    public admin: Admin,
    private _service: AdministratorService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this._service.getEmailModels()
    .subscribe(data => {
      if(data.emails){
        data.emails.forEach(element => {
          this.emails.push(element)
        });
      }
    })
  }

  createEmailModel(){
    this._service.createEmailModels(this.email).then(data => {
      if(data){
        const response = JSON.parse(JSON.stringify(data));
        if(response.status == 0 || response.status == 500){
          this.errors_modal = 'Erro interno.'
          return
        }
        if(response.status == 404){
          this.errors_modal = 'Falha de conexão.'
          return
        }

        var body = JSON.parse(response._body);
        if(response.status >= 200 && response.status <= 205){
          this.success = "Modelo de e-mail cadastrado"
          this.modalRef.hide();
          let r = {
            id: body[0].id,
            email: this.email.email
          }
          this.emails.unshift(r)
        }else if(response.status >= 400 && response.status < 500){
          if(body.errors){
            for(var key in body.errors) {
              this.errors_modal = body.errors[key];
              return
            }
          }
          for(var key in body) {
            this.errors_modal = body[key];
            return
          }
        }
      }else{
        this.errors_modal = 'Ocorreu algum erro para cadastrar o modelo de e-mail. Tente novamente!'
      }
    })
  }

  removeEmailModel(id){
    this._service.deletEmailModels(this.modelId).then(data =>{
      this.success, this.errors_modal, this.errors = null;
        if(data){
          const response = JSON.parse(JSON.stringify(data));
          if(response.status == 0 || response.status == 500){
            this.errors_modal = 'Erro interno.'
            return
          }
          if(response.status == 404){
            this.errors_modal = 'Modelo de e-mail não encontrado'
            return
          }
  
          var body = JSON.parse(response._body);
          if(response.status >= 200 && response.status <= 205){
            let id = this.modelId;
            this.emails.forEach(function(item, index, object) {
              if (item.id === id) {
                object.splice(index, 1);
              }
            });
            this.success = 'Modelo de e-mail deletado.'
            this.modalRef.hide();
          }else if(response.status >= 400 && response.status < 500){
            if(body.errors){
              for(var key in body.errors) {
                this.errors_modal = body.errors[key];
                return
              }
            }
            for(var key in body) {
              this.errors_modal = body[key];
              return
            }
          }
        }else{
          this.errors_modal = 'Ocorreu algum erro para deletar o modelo de e-mail. Tente novamente!'
        }

    })
  }

  createAdmin(){
    this._service.createAdmin(this.admin).then(data => {
      if(data){
        const response = JSON.parse(JSON.stringify(data));
        if(response.status == 0 || response.status == 500){
          this.errors_modal = 'Erro interno.'
          return
        }
        if(response.status == 404){
          this.errors_modal = 'Falha de conexão.'
          return
        }

        var body = JSON.parse(response._body);
        if(response.status >= 200 && response.status <= 205){
          if(body.message){
            for(var key in body.errors) {
              this.success = body.errors[key];
              return
            }
          }
          for(var key in body) {
            this.success = body[key];
            return
          }
          this.success = "E-mail enviado";

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
        this.errors = 'Ocorreu algum erro para cadastrar o e-mail. Tente novamente!'
      }
    })
  }

  openModal(template: TemplateRef<any>, config = false, id = null, name = null) {
    if(config){
      this.modalRef = this.modalService.show(template, this.config);
    }else{
      this.modalRef = this.modalService.show(template);
    }
    if(name){
      this.modelName = name
    }
    if(id){
      this.modelId = id
    }
  }

}
