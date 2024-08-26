import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaGuestRoutingModule } from './tienda-guest-routing.module';
import { TiendaGuestComponent } from './tienda-guest.component';
import { LandingCourseComponent } from './landing-course/landing-course.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FiltersCoursesComponent } from './filters-courses/filters-courses.component';


@NgModule({
  declarations: [
    TiendaGuestComponent,
    LandingCourseComponent,
    FiltersCoursesComponent
  ],
  imports: [
    CommonModule,
    TiendaGuestRoutingModule,
    SharedModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ]
})
export class TiendaGuestModule { }
