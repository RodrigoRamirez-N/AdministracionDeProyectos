import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolaEquipo4 } from './src/hola-equipo4/hola-equipo4';
const routes: Routes = [
    {
        path: '',
        component: HolaEquipo4,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo4RoutingModule { }
