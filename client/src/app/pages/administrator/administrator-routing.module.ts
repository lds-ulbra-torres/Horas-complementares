import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AdministratorComponent} from './administrator.component'

import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { SettingsComponent } from './settings/settings.component';
import { StudentComponent } from './student/student.component';
import { DetailsComponent } from './student/details/details.component';
import { CertificateComponent } from './student/certificate/certificate.component'
import { AtaComponent } from './ata/ata.component';
import { CreateAtaComponent } from './ata/create/create-ata.component';
import { DetailsAtaComponent } from './ata/details/details-ata.component'
import { GroupComponent } from './rules/group/group.component'


const dashboardAdministratorRoutes: Routes = [
  {
    path: '', component: AdministratorComponent,
    children:[
      {path: '', component: HomeComponent},
      {path: 'alunos', component: StudentComponent},
      {path: 'aluno/:id', component: DetailsComponent},
      {path: 'aluno/:student/certificado/:certificate', component: CertificateComponent},
      {path: 'regras', component: RulesComponent},
      {path: 'grupos', component: GroupComponent},
      {path: 'configuracoes', component: SettingsComponent},
      {path: 'ata', component: AtaComponent},
      {path: 'ata/detalhes/:id', component: DetailsAtaComponent},
      {path: 'ata/cadastrar', component: CreateAtaComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardAdministratorRoutes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
