import { Component } from '@angular/core';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { Toaster } from 'ngx-toast-notifications';
import { CartService } from '../../home/service/cart.service';

declare var $:any;
@Component({
  selector: 'app-filters-courses',
  templateUrl: './filters-courses.component.html',
  styleUrls: ['./filters-courses.component.css']
})
export class FiltersCoursesComponent {

  CATEGORIES:any = [];
  INSTRUCTORES:any = [];
  LEVELS:any = [];
  IDIOMAS:any = [];

  select_option:number = 1;

  COURSES:any = [];
  user:any;
  // Filtros
  selected_categories:any = [];
  selected_instructors:any = [];
  selected_levels:any = [];
  selected_idiomas:any = [];
  min_price:number = 0;
  max_price:number = 0;
  rating_selected:number = 0;
  search_course:any;
  constructor(
    public tiendaGuestService: TiendaGuestService,
    public toaster: Toaster,
    public cartService: CartService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.tiendaGuestService.getConfigAll().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.INSTRUCTORES = resp.instructores;
      this.LEVELS = resp.levels;
      this.IDIOMAS = resp.idiomas;
    })
    this.user = this.tiendaGuestService.authService.user;
    this.filterCourses();
  }

  addOption(val:number){
    this.select_option = val;
    if(this.select_option == 2){
      setTimeout(() => {
        $('#slider-range').slider({
            range: true,
            min: 10,
            max: 500,
            values: [0, 100],
            slide: (event:any, ui:any) => {
                $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
                this.min_price = ui.values[0];
                this.max_price = ui.values[1];
                // LA FUNCION 
            },
            stop: () => {
              console.log(this.min_price,this.max_price);
              this.filterCourses();
            },
        });
        $('#amount').val('$' + $('#slider-range').slider('values', 0) +
          " - $" + $('#slider-range').slider('values', 1));
      }, 50);
    }
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
  
  addCategorie(ID_CATEGORIE:any){
    let INDEX = this.selected_categories.findIndex((item:any) => item == ID_CATEGORIE);
    if(INDEX != -1){
      this.selected_categories.splice(INDEX,1);
    }else{
      this.selected_categories.push(ID_CATEGORIE);
    }
    this.filterCourses();
  }

  addInstructor(ID_INSTRUCTOR:any){
    let INDEX = this.selected_instructors.findIndex((item:any) => item == ID_INSTRUCTOR);
    if(INDEX != -1){
      this.selected_instructors.splice(INDEX,1);
    }else{
      this.selected_instructors.push(ID_INSTRUCTOR);
    }
    this.filterCourses();
  }

  addLevels(LEVEL:any){
    let INDEX = this.selected_levels.findIndex((item:any) => item == LEVEL);
    if(INDEX != -1){
      this.selected_levels.splice(INDEX,1);
    }else{
      this.selected_levels.push(LEVEL);
    }
    this.filterCourses();
  }

  addIdioma(IDIOMA:any){
    let INDEX = this.selected_idiomas.findIndex((item:any) => item == IDIOMA);
    if(INDEX != -1){
      this.selected_idiomas.splice(INDEX,1);
    }else{
      this.selected_idiomas.push(IDIOMA);
    }
    this.filterCourses();
  }

  selectedRating(rating:number){
    this.rating_selected = rating;
    this.filterCourses();
  }

  filterCourses(){

    let data = {
      selected_categories: this.selected_categories,
      selected_instructors: this.selected_instructors,
      selected_levels: this.selected_levels,
      selected_idiomas: this.selected_idiomas,
      min_price: this.min_price,
      max_price: this.max_price,
      rating_selected: this.rating_selected,
      search: this.search_course,
    };

    this.tiendaGuestService.searchCourse(data).subscribe((resp:any) => {
      console.log(resp);
      this.COURSES = resp.courses;
    })
  }
}
