import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from '@angular/router';
import {StudentService} from './../../../services/student/student.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [StudentService]
})
export class HomeComponent implements OnInit {


  certificates = [];
  certificates_count = 0;
  certificates_approves_count = 0;
  total_hours = 0;

  public status = '-1';

  total_page;
  current_page;
  modalRef: BsModalRef;

  constructor(
    private _route: Router,
    private _service: StudentService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this._service.getCertificates()
    .subscribe(data =>{
      if(data.certificates.data){
        this.total_page = data.certificates.last_page;
        this.current_page = 1;
        data.certificates.data.forEach(element => {
          this.certificates.push(element)
          if(element.status == 1){
            this.certificates_approves_count += 1;
          }
        });
      }
      this.certificates_count = data.count;
    })
    this._service.totalHours()
    .subscribe(data => {
      this.total_hours = data.total_hours
    })
  }

  toCertificate(id){
    this._route.navigate(['dashboard/student/certificado/'+id])
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  filter(page = this.current_page){
    this.certificates = [];
    this._service.getCertificates(this.status, page)
    .subscribe(data =>{
      if(data.certificates.data){
        data.certificates.data.forEach(element => {
          this.certificates.push(element)
        });
      }
      this.certificates_count = data.count;
    })
  }
  prev(){
    if(this.current_page > 1){
      let page = this.current_page  -1;
      this.current_page = page;
      this.filter(page);
    }
  }
  next(){
    if(this.current_page < this.total_page){
      let page = this.current_page + 1;
      this.current_page = page;
      this.filter(page)
    }
  }
}
