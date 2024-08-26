import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { URL_FROTEND, URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any = null;
  token:any = null;
  constructor(
    public http: HttpClient,
    public router: Router,
  ) { 
    this.initAuthToken();
  }

  initAuthToken(){
    if(localStorage.getItem("token")){
      this.user = JSON.parse(localStorage.getItem("user") ?? '');
      this.token = localStorage.getItem("token");
    }
  }

  login(email:string,password:string){
    let URL = URL_SERVICIOS + "/users/login_tienda";
    return this.http.post(URL,{email: email, password: password}).pipe(
      map((auth: any) => {
        console.log(auth);
        const result = this.savelocalStorage(auth);
        return result;
      }),
      catchError((err:any) => {
        console.log(err);
        return of(undefined);
      }),
    )
    ;
  }

  register(data:any){
    let URL = URL_SERVICIOS+"/users/register";
    return this.http.post(URL,data);
  }

  savelocalStorage(auth:any){
    if(auth && auth.USER.token){
      localStorage.setItem("token",auth.USER.token);
      localStorage.setItem("user",JSON.stringify(auth.USER.user));
      return true;
    }
    return false;
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      // this.router.navigateByUrl("/auth/login");
      location.href = URL_FROTEND+"/auth/login";
    }, 50);
  }
}
