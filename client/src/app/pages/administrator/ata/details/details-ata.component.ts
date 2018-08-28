import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AdministratorService} from './../../../../services/administrator/administrator.service';
import {Ata} from './../../../../models/ata';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-details-ata',
  templateUrl: './details-ata.component.html',
  styleUrls: ['./details-ata.component.css'],
  providers: [AdministratorService, Ata]
})
export class DetailsAtaComponent implements OnInit {
  errors: string;
  success: string;
  ataId;
  students = [];

  constructor(
    public ata: Ata,
    private _service: AdministratorService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  @ViewChild('to-pdf') element: ElementRef;

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.ataId = params.id;
    });

    this._service.getAta(this.ataId)
    .subscribe(data => {
      if(data.atas){
        this.ata.year = data.atas.year;
        this.ata.semester = data.atas.semester;
        data.atas.students.forEach(element => {
          this.students.push(element)
        });
      }
    })

  }

  GeneratePDF () {
    const elementToPrint = document.getElementById('pdf'); //The html element to become a pdf
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addHTML(elementToPrint, () => {
        pdf.save('web.pdf');
    });
  }
}
