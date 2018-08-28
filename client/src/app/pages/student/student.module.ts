import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {StudentRoutingModule} from './student-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';


import { StudentComponent } from './student.component';
import { HomeComponent } from './home/home.component';
import { CertificateComponent } from './certificate/certificate.component';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentRoutingModule,
    ModalModule.forRoot(),
    PdfViewerModule
  ],
  declarations: [StudentComponent, HomeComponent, CertificateComponent]
})
export class StudentModule { }
