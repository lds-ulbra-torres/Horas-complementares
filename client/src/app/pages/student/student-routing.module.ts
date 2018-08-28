import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentComponent } from './student.component';
import { HomeComponent } from './home/home.component';
import { CertificateComponent } from './certificate/certificate.component';


const dashboardStudentRoutes: Routes = [
  {
    path: '', component: StudentComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'certificado/:id', component: CertificateComponent}    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardStudentRoutes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
