import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(public authService: AuthService) {
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      if(!this.authService.user){
        this.authService.logout();
        return false;
      }
      
      let token = this.authService.token;
      if(!token){
        this.authService.logout();
        return false;
      }

      let expiration = (JSON.parse((atob(token.split(".")[1])))).exp;
      if(Math.floor((new Date()).getTime()/ 1000) >= expiration){
        this.authService.logout();
        return false;
      }

      return true;
  }
  
}
