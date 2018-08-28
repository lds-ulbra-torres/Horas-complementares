import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../../services/administrator/administrator.service';
import {Ata} from './../../../../models/ata';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
export class Student{
  id: number;
  name: string;
  matricula: string;
  cgu: string;
  accumulated_hours:number;
  status: string;
}
@Component({
  selector: 'app-create-ata',
  templateUrl: './create-ata.component.html',
  styleUrls: ['./create-ata.component.css'],
  providers: [AdministratorService, Student, Ata]
})
export class CreateAtaComponent implements OnInit {
  errors: string;
  success: string;

  modalRef: BsModalRef;
  config = {
    class: 'modal-lg'
  }

  students = [];
  students2 = [];
  students_selected = [];

  public ma_cgu_search;
  public hours_search;
  constructor(
    public ata: Ata,
    public student: Student,
    private _service: AdministratorService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.ata.students = [];
    this._service.getStudents()
    .subscribe(data => {
      if(data){
        if(data.students){
          data.students.forEach(element => {
            this.students.push(element)
            this.students2.push(element)
          });
        }
      }
    })
  }

  createAta(){
    this.ata.students = this.students_selected;
    this._service.createAta(this.ata).then(data => {
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
          this.success = "Ata cadastrada"
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
        this.errors = 'Ocorreu algum erro para cadastrar a ata. Tente novamente!'
      }
    });
  }

  getStudent(id, name, matricula, accumulated_hours){
    let s = {
      id: id,
      name: name,
      matricula: matricula,
      accumulated_hours: accumulated_hours,
      status: 'ENTRREGUE'
    }
    this.students_selected.unshift(s);
    this.students.forEach(function(item, index, object) {
      if (item.id === id) {
        object.splice(index, 1);
      }
    });
  }

  rollBackStudent(id, name, matricula, accumulated_hours){
    let s = {
      id: id,
      name: name,
      matricula: matricula,
      accumulated_hours: accumulated_hours
    }
    this.students.push(s);
    this.students_selected.forEach(function(item, index, object) {
      if (item.id === id) {
        object.splice(index, 1);
      }
    });
  }

  changeStudnet(){
    this.students_selected.forEach(item => {
      if (item.id === this.student.id) {
        item.name = this.student.name;
        item.matricula = this.student.matricula;
        item.accumulated_hours = this.student.accumulated_hours;
        item.status = this.student.status;
      }
    })
    this.modalRef.hide();
  }

  searchStudent(){
    this.students = this.students2;
    if(this.ma_cgu_search != ' ' || this.hours_search != ' '){
      this.students = [];
      this.students2.forEach(e => {
        e.name.toLowerCase();
        e.matricula.toLowerCase();
        if(e.name.indexOf(this.ma_cgu_search) > -1 || e.matricula == this.ma_cgu_search || e.accumulated_hours >= this.hours_search){
          this.students.push(e)
        }
      })
    }
  }

  openModal(template: TemplateRef<any>, id, name, matricula, accumulated_hours, status) {
    this.modalRef = this.modalService.show(template, this.config);
    this.student.id = id;
    this.student.name = name;
    this.student.matricula = matricula;
    this.student.accumulated_hours = accumulated_hours;
    this.student.status = status;
  }

}
