import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  home(TIME_NOW:any){
    let URL = URL_SERVICIOS+"/home/list?TIME_NOW="+TIME_NOW;
    return this.http.get(URL);
  }
}
