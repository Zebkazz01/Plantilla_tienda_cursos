import { Component } from '@angular/core';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { CartService } from '../../home/service/cart.service';

declare function HOMEINIT([]):any;
declare var $:any;
declare function magnigyPopup([]):any;
declare function showMoreBtn([]):any;
@Component({
  selector: 'app-landing-course',
  templateUrl: './landing-course.component.html',
  styleUrls: ['./landing-course.component.css']
})
export class LandingCourseComponent {

  SLUG:any = null;
  COURSE_LANDING:any = null;
  COURSE_INSTRUCTOR:any = [];
  COURSE_CATEGORIES:any = [];
  CAMPAING_SPECIAL:any = null;
  user:any;
  REVIEWS:any = [];
  student_have_course:Boolean = false;
  constructor(
    public TiendaGuestService: TiendaGuestService,
    public activedRouter: ActivatedRoute,
    public toaster: Toaster,
    public cartService: CartService,
  ) {
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activedRouter.params.subscribe((resp:any) => {
      this.SLUG = resp.slug;
    })
    this.activedRouter.queryParams.subscribe((resp:any) => {
      this.CAMPAING_SPECIAL = resp.campaing_discount;
    })
    this.TiendaGuestService.showCourse(this.SLUG,this.CAMPAING_SPECIAL).subscribe((resp:any) => {
      console.log(resp);
      this.COURSE_LANDING = resp.course;
      this.COURSE_INSTRUCTOR = resp.course_instructor;
      this.COURSE_CATEGORIES = resp.course_relateds;
      this.REVIEWS = resp.reviews;
      this.student_have_course = resp.student_have_course;
      setTimeout(() => {
        HOMEINIT($);
        magnigyPopup($);
        showMoreBtn($);
      }, 50);
    })
    this.user = this.cartService.authService.user;
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

  addCart(){
    if(!this.user){
      this.toaster.open({text: 'NECESITAS INGRESAR CON TU CUENTA AL SISTEMA',caption: 'VALIDACIÓN',type: 'warning'});
      this.cartService.authService.router.navigateByUrl("auth/login");
      return;
    }
    let data = {
      course: this.COURSE_LANDING._id,
      type_discount: this.COURSE_LANDING.discount_g ? this.COURSE_LANDING.discount_g.type_discount : null,
      discount: this.COURSE_LANDING.discount_g ? this.COURSE_LANDING.discount_g.discount : null,
      campaign_discount: this.COURSE_LANDING.discount_g ? this.COURSE_LANDING.discount_g.type_campaign : null,
      code_cupon: null,
      code_discount: this.COURSE_LANDING.discount_g ? this.COURSE_LANDING.discount_g._id : null,
      price_unit: this.COURSE_LANDING.price_usd,
      subtotal: this.getTotalPriceCourse(this.COURSE_LANDING),
      total: this.getTotalPriceCourse(this.COURSE_LANDING),
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
