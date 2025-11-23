import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolaEquipo1 } from './src/hola-equipo1/hola-equipo1';
import { TourVirtual } from './src/tour-virtual/tour-virtual';
import { Galeria } from './src/galeria/galeria';
import { Transporte } from './src/transporte/transporte';
import { Rutasurbanas } from './src/rutasurbanas/rutasurbanas';

const routes: Routes = [
	{
		path: '',
		component: HolaEquipo1,
	},
	{
		path: 'tour-virtual',
		component: TourVirtual,
	},
    {
		path: 'Galeria',
		component: Galeria,
	},
	{
		path: 'transporte',
		component: Transporte,
	},

	{ path: 'rutas-urbanas', component: Rutasurbanas },

];

@NgModule({	
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class Equipo1RoutingModule { }
