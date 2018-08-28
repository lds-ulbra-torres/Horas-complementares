import {Inject, Component, OnInit, TemplateRef, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from './../../../services/student/student.service';
import {Certificate} from './../../../models/certificate';
import { DomSanitizer } from '@angular/platform-browser';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css'],
  providers: [StudentService, Certificate]
})
export class CertificateComponent implements OnInit {
  errors_modal: string;
  success_modal: string;
  success: string;
  errors: string;
  modalRef: BsModalRef;

  public id;
  public fileType = 'img';
  public safeUrl;

  config = {
    class: 'modal-lg'
  }

  form: FormGroup;
  loading: boolean = false;

  @ViewChild('fileInputUpdate') fileInput: ElementRef;

  constructor(
    public certificate: Certificate,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
    private _service: StudentService,
    private modalService: BsModalService,
    public sanitizer: DomSanitizer,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
    this.form = fb.group({
      event: ['', Validators.required],
      date_event: null,
      institution: null,
      ch: null,
      certificate_file: null
    });
    this.sanitizer = sanitizer;
  }
  ngOnInit() {

    this._activatedRoute.params.subscribe(params => {
      this.certificate.id = params.id;
    });

    this._service.getCertificate(this.certificate.id)
    .subscribe(data => {
      if(data.certificate){
        this.certificate = data.certificate;
        if(data.certificate.file_url.split('.').pop() == 'pdf'){
          this.fileType = 'pdf';
          this.getTrustedUrl(data.certificate.file_url)
        }
      }
      this.form.patchValue({
        event: this.certificate.event,
        date_event: this.certificate.date_event,
        institution: this.certificate.institution,
        ch: this.certificate.ch
      })
    })
  }

  getTrustedUrl(url:any){ 
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('certificate_file').setValue(file);
    }
  }

  clearFile() {
    this.form.get('certificate_file').setValue(null);
    (<HTMLInputElement>document.getElementById('certificate_file')).value = "";
  }

  private prepareSave(): any {
    var input: FormData  = new FormData();
    input.append('event', this.form.get('event').value);
    input.append('date_event', this.form.get('date_event').value);
    input.append('institution', this.form.get('institution').value);
    input.append('ch', this.form.get('ch').value);
    input.append('file_url', this.certificate.file_url);
    if(this.form.get('certificate_file').value != "" && this.form.get('certificate_file')){
      input.append('certificate_file', this.form.get('certificate_file').value);
    }
    return input;
  }
  updateCertificate(){
    const formModel = this.prepareSave();
    this.success = null;
    this.errors_modal = null;
    
    this._service.updateCertificate(formModel, this.certificate.id)
    .then(data => {
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
          this.success = "Certificado alterado. Aguarde a avaliação de um admnistrador."
          this.modalRef.hide();
          this.certificate.event = this.form.get('event').value
          this.certificate.date_event = this.form.get('date_event').value
          this.certificate.institution = this.form.get('institution').value
          this.certificate.ch = this.form.get('ch').value
          this.certificate.status = 0;
          this.certificate.file_url = body[0].file_url
          if(this.certificate.file_url.split('.').pop() == 'pdf'){
            this.fileType = 'pdf';
            this.getTrustedUrl(this.certificate.file_url)
          }else{
            this.fileType = 'img';
          }
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
          this.errors_modal  = 'Ocorreu algum erro para seguir com esta operação. Tente novamente!';
        }
      }else{
        this.success = null;
        this.errors_modal = 'Ocorreu algum erro para alterar o certificado. Tente novamente!'
      }
    });
  }

  removeCertificate(){
    this._service.deleteCertificate(this.certificate.id).then(data => {
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
          this._route.navigate(['dashboard/student'])
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
          this.errors_modal  = 'Ocorreu algum erro para seguir com esta operação. Tente novamente!';
        }
      }else{
        this.errors_modal = 'Ocorreu algum erro para cadastrar o certificado. Tente novamente!'
      }
    })
  }

  openModal(template: TemplateRef<any>, config = false, id = null) {
    if(config){
      this.modalRef = this.modalService.show(template, this.config);
    }else{
      this.modalRef = this.modalService.show(template);
    }
    if(id){
      this.id = id
    }
  }

}
