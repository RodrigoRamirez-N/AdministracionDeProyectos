import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: Home },

	{
		path: 'equipo1',
		loadChildren: () =>
			import('./modules/equipo1/equipo1-routing-module').then((m) => m.Equipo1RoutingModule),
	},
    {
        path: 'equipo2',
        loadChildren: () => import('./modules/equipo2/equipo2-module').then((m) => m.Equipo2Module),
    },
    {
        path: 'equipo3',
        loadChildren: () =>
            import('./modules/equipo3/equipo3-routing-module').then((m) => m.Equipo3RoutingModule),
    },
    {
        path: 'equipo4',
        loadChildren: () =>
            import('./modules/equipo4/equipo4-routing-module').then((m) => m.Equipo4RoutingModule),
    },

	
];
