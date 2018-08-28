import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AdministratorService} from './../../../../services/administrator/administrator.service';
import {Certificate} from './../../../../models/certificate';
import { DomSanitizer } from '@angular/platform-browser';


export class Student{
  id: string;
  name: string;
  cgu: string;
  email: string;
}

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css'],
  providers: [AdministratorService, Student, Certificate]
})
export class CertificateComponent implements OnInit {
  errors: string;
  success: string;
  public safeUrl;
  public fileType = 'img'
  constructor(
    public certificate: Certificate,
    public student: Student,
    private _service: AdministratorService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
  ) {
    this.sanitizer = sanitizer;
   }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.student.id = params.student;
      this.certificate.id = params.certificate;
    });

    this._service.getStudent(this.student.id)
    .subscribe(data =>{
      if(data.student){
        this.student = data.student
      }
    })

    this._service.getCertificatesByStudentAndId(this.certificate.id, this.student.id)
    .subscribe(data => {
      if(data.certificate){
        this.certificate = data.certificate;
        if(data.certificate.file_url.split('.').pop() == 'pdf'){
          this.fileType = 'pdf';
          this.getTrustedUrl(data.certificate.file_url)
        }
      }
    })
  }

  getTrustedUrl(url:any){ 
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

}
