import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolaEquipo3 } from './src/hola-equipo3/hola-equipo3';

const routes: Routes = [
    {
        path: '',
        component: HolaEquipo3,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo3RoutingModule { }
