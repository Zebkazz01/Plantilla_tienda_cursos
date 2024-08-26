import { Component } from '@angular/core';
import { TiendaAuthService } from '../service/tienda-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-leason',
  templateUrl: './course-leason.component.html',
  styleUrls: ['./course-leason.component.css']
})
export class CourseLeasonComponent {

  slug_course:any;
  COURSE_SELECTED:any;
  CLASE_SELECTED:any;
  COURSE_STUDENT:any;

  CLASES_SELECTEDS:any = [];
  constructor(
    public tiendaAuth: TiendaAuthService,
    public activedRouter: ActivatedRoute,
    public router: Router,
    public toaster: Toaster,
    public Sanitizer: DomSanitizer,
  ) {
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activedRouter.params.subscribe((resp:any) => {
      this.slug_course = resp.slug;
    })
    this.tiendaAuth.courseLeason(this.slug_course).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'VALIDACION',type: 'warning'});
        this.router.navigateByUrl("/");
      }else{
        this.COURSE_SELECTED = resp.course;
        // console.log(this.COURSE_SELECTED.malla_curricular[0]);
        this.CLASE_SELECTED = this.COURSE_SELECTED.malla_curricular[0].clases[0];
        this.COURSE_STUDENT = resp.course_student;
        this.CLASES_SELECTEDS = this.COURSE_STUDENT.clases_checked;
      }
    })
  }

  selectedClase(CLASE:any){
    this.CLASE_SELECTED = CLASE;
  }
  checkedClase(CLASE:any){

    let INDEX = this.CLASES_SELECTEDS.findIndex((item:any) => item == CLASE._id);
    if(INDEX != -1){
      this.CLASES_SELECTEDS.splice(INDEX,1);
    }else{
      this.CLASES_SELECTEDS.push(CLASE._id);
    }
    // LA SOLICITUD AL BACKEND PARA GUARDAR LA INFORMACIÓN
    let data = {
      _id: this.COURSE_STUDENT._id,
      clases_checked: this.CLASES_SELECTEDS,
      state: this.CLASES_SELECTEDS.length == this.COURSE_SELECTED.num_clases ? 2 : 1,
    }
    this.tiendaAuth.updateClase(data).subscribe((resp:any) => {
      console.log(resp);
    })
  }
  urlVideo(CLASE_SELECT:any){
    return this.Sanitizer.bypassSecurityTrustResourceUrl(CLASE_SELECT.vimeo_id);
  }
}
