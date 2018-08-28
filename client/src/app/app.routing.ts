import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuard } from './guards/auth-guard';


import { LoginComponent } from './pages/login/login.component';
import { NewAdminComponent } from './pages/new-admin/new-admin.component';

const appRoutes : Routes =
  [
    {
      path: '',
      component: LoginComponent
    },
    {
      path: 'completar/admin/:token',
      component: NewAdminComponent
    },
    {
      path: 'dashboard/student',
      canActivate: [AuthGuard],
      /*canActivateChild: [AuthGuardClient],*/
      loadChildren: './pages/student/student.module#StudentModule'
    },
    {
      path: 'dashboard/admin',
      canActivate: [AuthGuard],
      /*canActivateChild: [AuthGuardAdministrator],*/
      loadChildren: './pages/administrator/administrator.module#AdministratorModule'
    }
  ];
  @NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: []
  })
  export class AppRoutingModule {
  }