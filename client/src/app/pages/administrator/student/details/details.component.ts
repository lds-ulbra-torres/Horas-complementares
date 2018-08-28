import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AdministratorService} from './../../../../services/administrator/administrator.service';

export class Student{
  id: string;
  name: string;
  cgu: string;
  email: string;
  matricula: string;
  accumulated_hours: number;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [AdministratorService, Student]
})
export class DetailsComponent implements OnInit {
  certificates = [];
  certificates_count = 0;
  constructor(
    public student: Student,
    private _service: AdministratorService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.student.id = params.id;
    });

    this._service.getStudent(this.student.id )
    .subscribe(data =>{
      if(data.student){
        this.student.name = data.student.name
        this.student.cgu = data.student.cgu;
        this.student.email = data.student.email;
        this.student.matricula = data.student.matricula
        this.student.accumulated_hours = data.student.accumulated_hours
      }
    })

    this._service.getCertificatesByStudent(this.student.id)
    .subscribe(data => {
      if(data.certificates){
        data.certificates.forEach(element => {
          this.certificates.push(element)
        });
        this.certificates_count = data.count
      }
    })
  }

  toCertificate(student, id){
    this._route.navigate(['dashboard/admin/aluno/'+student+'/certificado/'+id])
  }

}
