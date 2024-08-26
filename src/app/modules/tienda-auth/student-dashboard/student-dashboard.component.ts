import { Component } from '@angular/core';
import { TiendaAuthService } from '../service/tienda-auth.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {

  nav_option:number = 1;

  enrolled_course_count:number = 0;
  actived_course_count:number = 0;
  termined_course_count:number = 0;
  
  profile_student: any;

  enrolled_course_news:any = [];
  actived_course_news:any = [];
  termined_course_news:any = [];

  sales:any = [];
  // USER
  name:string = '';
  surname:string = '';
  email:string = '';
  avatar:any = null;
  avatar_previzualiza:any = null;
  password:string = '';
  password_confirmation:string = '';
  profession:string = '';
  description:string = '';
  phone:string = '';
  birthday:string = '';

  sales_details:any = [];
  sale_detail_selected:any = null;
  description_review:any = null;
  rating:number = 0;
  constructor(
    public tiendaAuthService: TiendaAuthService,
    public toaster: Toaster,
  ) {
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.tiendaAuthService.profileStudent().subscribe((resp:any) => {
      console.log(resp);
      this.enrolled_course_count = resp.enrolled_course_count;
      this.actived_course_count = resp.actived_course_count;
      this.termined_course_count = resp.termined_course_count;
      this.profile_student = resp.profile;

      this.name = this.profile_student.name;
      this.surname = this.profile_student.surname;
      this.email = this.profile_student.email;
      // this.avatar = this.profile_student.avatar;
      this.avatar_previzualiza = this.profile_student.avatar ? this.profile_student.avatar : 'assets/images/team/avatar-2.jpg';
      this.profession = this.profile_student.profession;
      this.description = this.profile_student.description;
      this.phone = this.profile_student.phone;
      this.birthday = this.profile_student.birthday_format;

      this.enrolled_course_news = resp.enrolled_course_news;
      this.actived_course_news = resp.actived_course_news;
      this.termined_course_news = resp.termined_course_news;

      this.sales = resp.sales;
      this.sales_details = resp.sales_details;
    })
  }

  navOption(val:number) {
    this.nav_option = val;
  }

  showDetails(sale:any){
    sale.is_detail = true;
  }
  logout(){
    this.tiendaAuthService.authService.logout();
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: 'NECESITAS SUBIR UN ARCHIVO DE TIPO IMAGEN',caption: 'VALIDACIÓN',type: 'warning'});
      return;
    }
    this.avatar = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.avatar);
    reader.onloadend = () => this.avatar_previzualiza = reader.result;
  }

  updatedStudent(){
    if(!this.name  || !this.surname || !this.email){
      this.toaster.open({text: 'NECESITAS COMPLETAR LOS CAMPOS OBLIGATORIOS',caption: 'VALIDACIÓN',type: 'warning'});
      return;
    }
    if(this.password || this.password_confirmation){
      if(this.password != this.password_confirmation){
        this.toaster.open({text: 'LAS CONTRASEÑAS TIENE QUE SER IGUALES',caption: 'VALIDACIÓN',type: 'warning'});
        return;
      }
    }
    
    let formData = new FormData();

    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("phone",this.phone);
    formData.append("profession",this.profession);
    formData.append("description",this.description);
    if(this.birthday){
      formData.append("birthday",this.birthday);
    }
    if(this.password){
      formData.append("password",this.password);
    }
    if(this.avatar){
      formData.append("avatar",this.avatar);
    }

    this.tiendaAuthService.updateStudent(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text,caption: 'VALIDACIÓN',type: 'warning'});
      }else{
        this.toaster.open({text: resp.message_text,caption: 'PROCESO CORRECTO',type: 'primary'});
        localStorage.setItem("user",JSON.stringify({
          name: resp.user.name,
          email: resp.user.email,
          surname: resp.user.surname, 
         }));
      }
    })
  }

  showReview(sale_detail:any){
    this.sale_detail_selected = sale_detail;
    this.rating = this.sale_detail_selected.review ? this.sale_detail_selected.review.rating : '';
    this.description_review = this.sale_detail_selected.review ? this.sale_detail_selected.review.description : '';
  }
  selectedRating(val:number){
    this.rating = val;
  }
  back(){
    this.sale_detail_selected = null;
  }
  saveReview(){
    if(this.rating == 0){
      this.toaster.open({text: 'NECESITAS SELECCIONAR UNA CALIFICACIÓN',caption: 'VALIDACIÓN',type: 'warning'});
      return;
    }
    if(!this.description){
      this.toaster.open({text: 'NECESITAS DIGITAR UNA DESCRIPCIÓN',caption: 'VALIDACIÓN',type: 'warning'});
      return;
    }
    let data = {
      course: this.sale_detail_selected.course._id,
      sale_detail: this.sale_detail_selected._id,
      rating: this.rating,
      description: this.description_review,
    }
    this.tiendaAuthService.registerReview(data).subscribe((resp:any) => {
      console.log(resp);

      this.toaster.open({text: resp.message,caption: 'VALIDACIÓN',type: 'primary'});

      let index = this.sales_details.findIndex((item:any) => item._id == this.sale_detail_selected._id);
      if(index != -1){
        this.sales_details[index].review = resp.review;
      }
      this.rating = 0;
      this.description_review = '';
      this.sale_detail_selected = null;
    })
  }
  updateReview(){
    if(this.rating == 0){
      this.toaster.open({text: 'NECESITAS SELECCIONAR UNA CALIFICACIÓN',caption: 'VALIDACIÓN',type: 'warning'});
      return;
    }
    if(!this.description){
      this.toaster.open({text: 'NECESITAS DIGITAR UNA DESCRIPCIÓN',caption: 'VALIDACIÓN',type: 'warning'});
      return;
    }
    let data = {
      course: this.sale_detail_selected.course._id,
      sale_detail: this.sale_detail_selected._id,
      rating: this.rating,
      description: this.description_review,
      _id: this.sale_detail_selected.review._id,
    }
    this.tiendaAuthService.updateReview(data).subscribe((resp:any) => {
      console.log(resp);

      this.toaster.open({text: resp.message,caption: 'VALIDACIÓN',type: 'primary'});

      let index = this.sales_details.findIndex((item:any) => item._id == this.sale_detail_selected._id);
      if(index != -1){
        this.sales_details[index].review = resp.review;
      }
    })
  }
}
