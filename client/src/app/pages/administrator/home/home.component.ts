import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../services/administrator/administrator.service';
import {Certificate} from './../../../models/certificate';
import { DomSanitizer } from '@angular/platform-browser';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AdministratorService, Certificate]
})
export class HomeComponent implements OnInit {
  success_modal: string;
  errors_modal: string;
  success: string;
  errors: string;

  modalRef: BsModalRef;

  config = {
    class: 'modal-lg'
  }

  certificates = [];
  certificates_count = 0;
  rules = [];

  public fileType = 'img';
  public safeUrl;

  constructor(
    public certificate: Certificate,
    private _service: AdministratorService,
    private modalService: BsModalService,
    public sanitizer: DomSanitizer,
  ) {
    this.sanitizer = sanitizer;
   }

  ngOnInit() {
    this._service.getAllCertificates(0)
    .subscribe(data => {
      if(data){
        if(data.certificates){
          data.certificates.forEach(element => {
            this.certificates.push(element)
          });
        }
        this.certificates_count = data.count;
      }
    })
    this._service.getRules()
    .subscribe(data =>{
      if(data.rules){
        data.rules.forEach(element => {
          this.rules.push(element)
        });
      }
    })
  }

  getTrustedUrl(url:any){ 
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

  openModal(template: TemplateRef<any>, config = false, c, s) {
    if(config){
      this.modalRef = this.modalService.show(template, this.config);
    }else{
      this.modalRef = this.modalService.show(template);
    }
    this.getCertificate(c, s);
  }

  private getCertificate(certificate, student){
    this._service.getCertificatesByStudentAndId(certificate, student)
    .subscribe(data => {
      if(data){
        if(data.certificate){
          this.certificate = data.certificate
          
          if(data.certificate.file_url.split('.').pop() == 'pdf'){
            this.fileType = 'pdf';
            this.getTrustedUrl(this.certificate.file_url);
          }else{
            this.fileType = 'img';
          }
        }
      }
    })
  }

  checkCertificate(status = 0){
    this.certificate.status = status;
    this._service.evaluateCertificate(this.certificate, this.certificate.id).then(data =>{
      if(data){
        let id = this.certificate.id;
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
          this.success = "Certificado avaliado com sucesso."
          this.modalRef.hide();
          this.certificates.forEach(function(item, index, object) {
            if (item.id === id) {
              object.splice(index, 1);
            }
          });
          this.certificates_count = this.certificates_count - 1;
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
        this.errors_modal = 'Ocorreu algum erro para avaliar o certificado. Tente novamente!'
      }
    });
  }

}
