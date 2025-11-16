import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolaEquipo2Component } from './src/hola-equipo2/hola-equipo2.component';

const routes: Routes = [
  {
    path: '', 
    component: HolaEquipo2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo2RoutingModule { }