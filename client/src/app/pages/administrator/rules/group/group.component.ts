import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../../services/administrator/administrator.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

export class Group{
  name: string;
  max_hours: string;
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [AdministratorService, Group]
})
export class GroupComponent implements OnInit {

  errors: string;
  success: string;
  errors_modal: string;

  modalRef: BsModalRef;
  public groups = [];
  public name;
  public id;
  config = {
    class: 'modal-lg'
  }

  constructor(
    public group: Group,
    private _service: AdministratorService,
    private _route: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this._service.getGroups()
    .subscribe(data => {
      if(data.groups){
        data.groups.forEach(element => {
          this.groups.push(element)
        });
      }
    })
  }

  createGroup(){
    this.success, this.errors_modal, this.errors = null;

    this._service.createGroup(this.group).then(data => {
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
          this.success = "Atividade cadastrada"
          this.modalRef.hide();
          let r = {
            id: body[0].id,
            name: this.group.name,
            max_hours: this.group.max_hours
          }
          this.groups.unshift(r)
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
        this.errors_modal = 'Ocorreu algum erro para cadastrar a atividade. Tente novamente!'
      }
    });
  }

  removeGroup(id){
    this._service.deletGroup(id).then(data =>{
      this.success, this.errors_modal, this.errors = null;
        if(data){
          const response = JSON.parse(JSON.stringify(data));
          if(response.status == 0 || response.status == 500){
            this.errors_modal = 'Erro interno.'
            return
          }
          if(response.status == 404){
            this.errors_modal = 'Atividade não encontrada'
            return
          }
  
          var body = JSON.parse(response._body);
          if(response.status >= 200 && response.status <= 205){
            this.groups.forEach(function(item, index, object) {
              if (item.id === id) {
                object.splice(index, 1);
              }
            });
            this.success = 'Atividade deletada.'
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
          this.errors_modal = 'Ocorreu algum erro para deletar a atividade. Tente novamente!'
        }

    })
  }

  openModal(template: TemplateRef<any>, data = null, config = false, id = null) {
    if(config){
      this.modalRef = this.modalService.show(template, this.config);
    }else{
      this.modalRef = this.modalService.show(template);
    }
    if(data){
      this.name = data;
    }
    if(id){
      this.id = id
    }
  }

}
