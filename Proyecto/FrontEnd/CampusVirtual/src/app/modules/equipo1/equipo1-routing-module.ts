import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolaEquipo1 } from './src/hola-equipo1/hola-equipo1';
import { TourVirtual } from './src/tour-virtual/tour-virtual';

const routes: Routes = [
	{
		path: '',
		component: HolaEquipo1,
	},
	{
		path: 'tour-virtual',
		component: TourVirtual,
	},
];

@NgModule({	
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class Equipo1RoutingModule { }
