import {Inject, Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from './../../services/student/student.service';
import {User} from './../../models/user';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

export class Certificate {
  event: string;
  date_event: string;
  institution: string;
  ch: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [StudentService, Certificate, User]
})
export class StudentComponent implements OnInit {
  errors: string;
  success: string;
  errors_certificate: string;
  success_certificate: string;

  modalRef: BsModalRef;

  config = {
    class: 'modal-lg'
  };

  config2 = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };

  form: FormGroup;
  loading: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('completeRegister') completeRegister: TemplateRef<any>;
  constructor(
    private _route: Router,
    private modalService: BsModalService,
    private _service: StudentService,
    public certificate: Certificate,
    public user: User,
    @Inject(FormBuilder) fb: FormBuilder
    ) {
      this.form = fb.group({
        event: ['', Validators.required],
        date_event: null,
        institution: null,
        ch: null,
        certificate_file: null
      });
    }

  ngOnInit() {
    this._service.info()
    .subscribe(data => {
      this.user = data.user;
      if(!this.user.student.cgu || this.user.student.cgu == ' '
        || !this.user.student.matricula || this.user.student.matricula == ' '){
          this.openModal(this.completeRegister, true);
        }
    })
  }

  openModal(template: TemplateRef<any>, config2 = false) {
    if(config2){
      this.modalRef = this.modalService.show(template, this.config2);
    }else{
      this.modalRef = this.modalService.show(template, this.config);
    }
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(file.size)
      if(file.size <= 6000000){
        this.form.get('certificate_file').setValue(file);
      }else{
        alert('Tamanho máximo excedido (máximo 5mb)');
      }
      
    }
  }

  private prepareSave(): any {
    var input: FormData  = new FormData();
    input.append('event', this.form.get('event').value);
    input.append('date_event', this.form.get('date_event').value);
    input.append('institution', this.form.get('institution').value);
    input.append('ch', this.form.get('ch').value);
    input.append('certificate_file', this.form.get('certificate_file').value);
    return input;
  }

  createCertificate(){
    const formModel = this.prepareSave();

    this.success = null;
    this.errors = null;
    this.errors_certificate = null;
    
    this._service.createCertificate(formModel)
    .then(data => {
      if(data){
        const response = JSON.parse(JSON.stringify(data));
        if(response.status == 0 || response.status == 500){
          this.errors_certificate = 'Erro interno.'
          return
        }
        if(response.status == 404){
          this.errors_certificate = 'Falha de conexão.'
          return
        }

        var body = JSON.parse(response._body);
        if(response.status >= 200 && response.status <= 205){
          this.success = "Certificado enviado. Aguarde a avaliação de um admnistrador."
          this.modalRef.hide();
          this._route.navigate(['dashboard/student/certificado/'+body[0].id]);
        }else if(response.status >= 400 && response.status < 500){
          if(body.errors){
            for(var key in body.errors) {
              this.errors_certificate = body.errors[key];
              return
            }
          }
          for(var key in body) {
            this.errors_certificate = body[key];
            return
          }
        }
      }else{
        this.success = null;
        this.errors_certificate = 'Ocorreu algum erro para cadastrar o certificado. Tente novamente!'
      }
    });
  }

  register(){
    this._service.completeRegister(this.user).then(data => {
      if(data){
        const response = JSON.parse(JSON.stringify(data));
        if(response.status == 0 || response.status == 500){
          this.errors_certificate = 'Erro interno.'
          return
        }
        if(response.status == 404){
          this.errors_certificate = 'Falha de conexão.'
          return
        }

        var body = JSON.parse(response._body);
        if(response.status >= 200 && response.status <= 205){
          this.success = "Dados salvos"
          this.modalRef.hide();
        }else if(response.status >= 400 && response.status < 500){
          if(body.errors){
            for(var key in body.errors) {
              this.errors_certificate = body.errors[key];
              return
            }
          }
          for(var key in body) {
            this.errors_certificate = body[key];
            return
          }
        }
      }else{
        this.success = null;
        this.errors_certificate = 'Ocorreu algum erro para slvar os dados. Tente novamente!'
      }
    })
  }

  toggleMenu(){
    if(document.getElementsByClassName('navbar-collapse collapse')[0]){
      document.getElementById('navbarResponsive').classList.remove('collapse', 'navbar-collapse')
    }else{
      console.log('a')
      document.getElementById('navbarResponsive').classList.add('collapse', 'navbar-collapse')
    }
  }

  logout(){
    localStorage.clear();
    sessionStorage.clear();
    this._route.navigate(['/']);
  }

}
