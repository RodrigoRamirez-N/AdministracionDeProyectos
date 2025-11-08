import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuFoodDesktop } from './src/pages/menu-food-desktop/menu-food-desktop';
import { MenuFoodMobile } from './src/pages/menu-food-mobile/menu-food-mobile';

// Elegimos 768px como breakpoint: >=768 desktop, <768 mobile
// Se evalúa en la coincidencia de la ruta (primera que cumple canMatch).
const routes: Routes = [
  {
    path: '',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth >= 768],
    component: MenuFoodDesktop,
  },
  {
    path: '',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth < 768],
    component: MenuFoodMobile,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo4RoutingModule { }
