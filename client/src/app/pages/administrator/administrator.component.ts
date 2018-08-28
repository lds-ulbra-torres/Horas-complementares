import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthOwnService} from './../../services/auth/authOwn.service';
import {User} from './../../models/user';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css'],
  providers: [AuthOwnService, User]
})
export class AdministratorComponent implements OnInit {
  success: string;
  errors: string;
  constructor(
    private _route: Router,
    private _service: AuthOwnService,
    public user: User
  ) { }

  ngOnInit() {
    this._service.info()
    .subscribe(data => {
      this.user = data.user;
    })
  }

  toggleMenu(){
    if(document.getElementsByClassName('navbar-collapse collapse show')[0]){
      document.getElementById('navbarResponsive').classList.remove('show')
    }else{
      document.getElementById('navbarResponsive').classList.add('show')
    }
  }

  goTo(r){
    this._route.navigate(['dashboard/admin/'+r]);    
  }

  home(){
    this._route.navigate(['dashboard/admin']);
  }

  logout(){
    localStorage.clear();
    sessionStorage.clear();
    this._route.navigate(['/']);
  }
}
