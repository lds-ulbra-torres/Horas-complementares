import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../services/administrator/administrator.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

export class Rule{
  id: number;
  classification: string;
  activity: string;
  percentage: number;
  group: number;
}

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
  providers: [Rule, AdministratorService]
})
export class RulesComponent implements OnInit {

  errors: string;
  success: string;
  errors_modal: string;

  modalRef: BsModalRef;
  public rules = [];
  public groups = [];
  public classification;
  public id;
  config = {
    class: 'modal-lg'
  }

  constructor(
    public rule: Rule,
    private _service: AdministratorService,
    private _route: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this._service.getRules()
    .subscribe(data => {
      if(data.rules){
        data.rules.forEach(element => {
          this.rules.push(element)
        });
      }
    })
    this._service.getGroups()
    .subscribe(data => {
      if(data){
        if(data.groups){
          data.groups.forEach(element => {
            this.groups.push(element)
          });
        }
      }
    })
  }

  createRules(){
    this.success, this.errors_modal, this.errors = null;

    this._service.createRule(this.rule).then(data => {
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
          this.success = "Regra cadastrada"
          this.modalRef.hide();
          let group_name = '';
          this.groups.forEach(e => {
            if(e.id == this.rule.group){
              group_name = e.name
            }
          })
          let r = {
            id: body[0].id,
            classification: this.rule.classification,
            activity: this.rule.activity,
            percentage: this.rule.percentage,
            name: group_name
          }
          this.rules.unshift(r)
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
        this.errors_modal = 'Ocorreu algum erro para cadastrar o certificado. Tente novamente!'
      }
    });
  }

  removeRule(id){
    this._service.deleteRule(id).then(data =>{
      this.success, this.errors_modal, this.errors = null;
        if(data){
          const response = JSON.parse(JSON.stringify(data));
          if(response.status == 0 || response.status == 500){
            this.errors_modal = 'Erro interno.'
            return
          }
          if(response.status == 404){
            this.errors_modal = 'Regra não encontrada'
            return
          }
  
          var body = JSON.parse(response._body);
          if(response.status >= 200 && response.status <= 205){
            this.rules.forEach(function(item, index, object) {
              if (item.id === id) {
                object.splice(index, 1);
              }
            });
            this.success = 'Regra deletada.'
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
          this.errors_modal = 'Ocorreu algum erro para cadastrar o certificado. Tente novamente!'
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
      this.classification = data;
    }
    if(id){
      this.id = id
    }
  }

}
