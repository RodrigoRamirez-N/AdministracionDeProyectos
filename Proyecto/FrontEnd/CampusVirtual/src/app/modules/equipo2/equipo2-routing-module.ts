import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolaEquipo2 } from './src/hola-equipo2/hola-equipo2';
import { TourVirtual } from './src/tour-virtual/tour-virtual';

const routes: Routes = [
    {
        path: '',
        component: HolaEquipo2,
    },
    {
        path: 'tour-virtual',
        component: TourVirtual,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Equipo2RoutingModule { }
