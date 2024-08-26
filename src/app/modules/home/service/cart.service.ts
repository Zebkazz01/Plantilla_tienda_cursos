import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart = new BehaviorSubject<Array<any>>([]);
  public currentData$ = this.cart.asObservable();

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  addCart(DATA:any){
    let listCart = this.cart.getValue();
    let Index = listCart.findIndex(item => item.course == DATA.course._id);
    if(Index == -1){
      listCart.unshift(DATA);
    }
    this.cart.next(listCart);
  }

  resetCart(){
    this.cart.next([]);
  }

  removeItemCart(DATA:any){
    let listCart = this.cart.getValue();
    let Index = listCart.findIndex(item => item._id == DATA._id);
    if(Index != -1){
      listCart.splice(Index,1);
    }
    this.cart.next(listCart);
  }

  // SE VAN A DEFINIR LOS ENDPOINTS DEL BACKEND
  listCart(){
    let headers = new HttpHeaders({"token": this.authService.token});
    let URL = URL_SERVICIOS+"/cart/list";
    return this.http.get(URL,{headers: headers});
  }
  registerCart(data:any){
    let headers = new HttpHeaders({"token": this.authService.token});
    let URL = URL_SERVICIOS+"/cart/register";
    return this.http.post(URL,data,{headers: headers});
  }
  deleteCart(cart_id:any){
    let headers = new HttpHeaders({"token": this.authService.token});
    let URL = URL_SERVICIOS+"/cart/remove/"+cart_id;
    return this.http.delete(URL,{headers: headers});
  }
  applyCupon(data:any){
    let headers = new HttpHeaders({"token": this.authService.token});
    let URL = URL_SERVICIOS+"/cart/update";
    return this.http.post(URL,data,{headers: headers});
  }
}
