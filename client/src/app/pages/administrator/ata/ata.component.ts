import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AdministratorService} from './../../../services/administrator/administrator.service';

@Component({
  selector: 'app-ata',
  templateUrl: './ata.component.html',
  styleUrls: ['./ata.component.css'],
  providers: [AdministratorService]
})
export class AtaComponent implements OnInit {
  errors: string;
  success: string;
  ata = [];
  constructor(
    private _route: Router,
    private _service: AdministratorService
  ) { }

  ngOnInit() {
    this._service.getAtas()
    .subscribe(data => {
      if(data.atas){
        data.atas.forEach(element => {
          this.ata.push(element)
        });
      }
    })
  }

  toCreate(){
    this._route.navigate(['dashboard/admin/ata/cadastrar']);
  }
  toDetails(id){
    this._route.navigate(['dashboard/admin/ata/detalhes/'+id]);    
  }
}
