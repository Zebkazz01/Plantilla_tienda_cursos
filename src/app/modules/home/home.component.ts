import { Component } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { HomeService } from './service/home.service';
import { CartService } from './service/cart.service';

declare function HOMEINIT([]):any;
declare var $:any;
declare function countdownT():any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  CATEGORIES:any = [];
  COURSES_TOP:any = [];
  CATEGORIES_SECTIONS:any = [];
  COURSES_BANNERS:any = [];
  CAMPAING_BANNER:any = [];

  COURSES_FLASH:any = [];
  CAMPAING_FLASH:any = [];

  user:any;
  constructor(
    private toaster: Toaster,
    public homeService: HomeService,
    public cartService: CartService,
    ) {
    
  }

  ngOnInit(): void {

    this.user = this.cartService.authService.user;
    let TIME_NOW = new Date().getTime();
    this.homeService.home(TIME_NOW).subscribe((resp:any) => {
      console.log(resp);

      this.CATEGORIES = resp.categories;
      this.COURSES_TOP = resp.courses_top;
      this.CATEGORIES_SECTIONS = resp.categories_sections;
      this.COURSES_BANNERS = resp.courses_banners;
      this.CAMPAING_BANNER = resp.campaing_banner;

      this.COURSES_FLASH = resp.courses_flash;
      this.CAMPAING_FLASH = resp.campaing_flash;

      setTimeout(() => {
        HOMEINIT($);
        this.showToast();
        countdownT();
      }, 50);
    })
    
  }

  showToast() {
    // this.toaster.open('Hello world!');
  }
  getNewTotal(COURSE:any,CAMPAING_BANNER:any){
    if(CAMPAING_BANNER.type_discount == 1){ //%
      return COURSE.price_usd - COURSE.price_usd*(CAMPAING_BANNER.discount*0.01);
    }else{
      return COURSE.price_usd - CAMPAING_BANNER.discount;
    }
  }
  getTotalPriceCourse(COURSE:any){
    if(COURSE.discount_g){
      return this.getNewTotal(COURSE,COURSE.discount_g);
    }
    return COURSE.price_usd;
  }


  addCart(COURSE:any,CAMPAIGN:any = null){
    if(!this.user){
      this.toaster.open({text: 'NECESITAS INGRESAR CON TU CUENTA AL SISTEMA',caption: 'VALIDACIÓN',type: 'warning'});
      this.cartService.authService.router.navigateByUrl("auth/login");
      return;
    }
    if(CAMPAIGN){
      COURSE.discount_g = CAMPAIGN;
    }
    let data = {
      course: COURSE._id,
      type_discount: COURSE.discount_g ? COURSE.discount_g.type_discount : null,
      discount: COURSE.discount_g ? COURSE.discount_g.discount : null,
      campaign_discount: COURSE.discount_g ? COURSE.discount_g.type_campaign : null,
      code_cupon: null,
      code_discount: COURSE.discount_g ? COURSE.discount_g._id : null,
      price_unit: COURSE.price_usd,
      subtotal: this.getTotalPriceCourse(COURSE),
      total: this.getTotalPriceCourse(COURSE),
    }

    this.cartService.registerCart(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text,caption: 'VALIDACIÓN',type: 'danger'});
      }else{
        this.cartService.addCart(resp.cart);
        this.toaster.open({text: resp.message_text,caption: 'VALIDACIÓN',type: 'primary'});
      }
    });
  }
}
