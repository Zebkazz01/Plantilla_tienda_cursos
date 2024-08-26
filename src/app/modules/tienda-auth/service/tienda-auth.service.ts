import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class TiendaAuthService {

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) { }

  registerOrder(data:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/checkout/register";
    return this.http.post(URL,data,{headers: headers});
  }

  profileStudent(){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/profile/client";
    return this.http.get(URL,{headers: headers});
  }

  updateStudent(formData:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/profile/update";
    return this.http.post(URL,formData,{headers: headers});
  }

  registerReview(formData:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/profile/review-register";
    return this.http.post(URL,formData,{headers: headers});
  }

  updateReview(formData:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/profile/review-update";
    return this.http.post(URL,formData,{headers: headers});
  }

  courseLeason(slug:string){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/profile/course/"+slug;
    return this.http.get(URL,{headers: headers});
  }

  updateClase(formData:any){
    let headers = new HttpHeaders({'token': this.authService.token});
    let URL = URL_SERVICIOS+"/profile/course-student";
    return this.http.post(URL,formData,{headers: headers});
  }
}
