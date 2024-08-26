import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaGuestComponent } from './tienda-guest.component';
import { LandingCourseComponent } from './landing-course/landing-course.component';
import { FiltersCoursesComponent } from './filters-courses/filters-courses.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaGuestComponent,
    children: [
      {
        path: 'landing-curso/:slug',
        component: LandingCourseComponent,
      },
      {
        path: 'filtros-de-cursos',
        component: FiltersCoursesComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaGuestRoutingModule { }
