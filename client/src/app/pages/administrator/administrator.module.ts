import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {AdministratorRoutingModule} from './administrator-routing.module';

import {AdministratorComponent} from './administrator.component';
import { HomeComponent } from './home/home.component';
import { RulesComponent } from './rules/rules.component';
import { SettingsComponent } from './settings/settings.component';
import { StudentComponent } from './student/student.component';
import { DetailsComponent } from './student/details/details.component';
import { CertificateComponent } from './student/certificate/certificate.component';
import { AtaComponent } from './ata/ata.component';
import { GroupComponent } from './rules/group/group.component';
import { CreateAtaComponent } from './ata/create/create-ata.component';
import { DetailsAtaComponent } from './ata/details/details-ata.component'

@NgModule({
  imports: [
    AdministratorRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [AdministratorComponent, HomeComponent, RulesComponent, SettingsComponent, StudentComponent, DetailsComponent, CertificateComponent, AtaComponent, GroupComponent, CreateAtaComponent, DetailsAtaComponent]
})
export class AdministratorModule { }
