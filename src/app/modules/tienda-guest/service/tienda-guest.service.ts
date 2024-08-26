import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TiendaGuestService {

  constructor(
    public http: HttpClient,
    public authService:AuthService,
  ) { }

  showCourse(slug:any,CAMPAING_SPECIAL = null){
    console.log(this.authService.token);
    let headers = new HttpHeaders({'token': this.authService.token ? this.authService.token : ''});
    let URL = URL_SERVICIOS+"/home/landing-curso/"+slug+"?TIME_NOW="+(new Date().getTime())+"&CAMPAING_SPECIAL="+(CAMPAING_SPECIAL ? CAMPAING_SPECIAL : '');
    return this.http.get(URL,{headers: headers});
  }

  getConfigAll(){
    let URL = URL_SERVICIOS+"/home/config-all";
    return this.http.get(URL);
  }

  searchCourse(data:any){
    let URL = URL_SERVICIOS+"/home/search-course/"+"?TIME_NOW="+(new Date().getTime());
    return this.http.post(URL,data);
  }
}
