import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../services/administrator/administrator.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [AdministratorService]
})
export class StudentComponent implements OnInit {

  students = [];
  students_count = 0;
  constructor(
    private _service: AdministratorService,
    private _route: Router
  ) { }

  ngOnInit() {
    this._service.getStudents()
    .subscribe(data => {
      if(data){
        if(data.students){
          data.students.forEach(element => {
            this.students.push(element)
          });
        }
        this.students_count = data.count;
      }
    })
  }

  toStudent(id){
    this._route.navigate(['dashboard/admin/aluno/'+id]);
  }
}
