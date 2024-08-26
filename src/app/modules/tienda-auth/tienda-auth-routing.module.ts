import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaAuthComponent } from './tienda-auth.component';
import { CartsComponent } from './carts/carts.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseLeasonComponent } from './course-leason/course-leason.component';

const routes: Routes = [{
  path: '',
  component: TiendaAuthComponent,
  children: [
    {
      path: 'carrito-de-compra',
      component: CartsComponent,
    },
    {
      path: 'perfil-del-estudiante',
      component: StudentDashboardComponent,
    },
    {
      path: 'ver-curso/:slug',
      component: CourseLeasonComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaAuthRoutingModule { }
