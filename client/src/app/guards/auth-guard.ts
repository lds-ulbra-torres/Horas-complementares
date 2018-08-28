import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, CanActivateChild } from '@angular/router';
import { getJwt } from '../../main';


@Injectable()
export class AuthGuard implements CanActivate, CanLoad  {
  constructor(
    private router: Router,
  ) { 
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | boolean {   
    return this.verifyAcess()  
  }
  canLoad(route : Route): Observable<boolean>|Promise<boolean>|boolean{    
    return this.verifyAcess()
  }

  verifyAcess(){
    if(!getJwt){          
        console.log("Permissão Negada!")    
        this.router.navigate(['/']);
        return false;    
    }else{
        return true;
    }
  } 

}