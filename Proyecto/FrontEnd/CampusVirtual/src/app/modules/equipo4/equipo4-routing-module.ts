import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuFoodDesktop } from './src/pages/menu-food-desktop/menu-food-desktop';
import { MenuFoodMobile } from './src/pages/menu-food-mobile/menu-food-mobile';

// Componentes de carrito por plataforma
import { CartFoodDesktop } from './src/pages/cart-food-desktop/cart-food-desktop';
import { CartFoodMobile } from './src/pages/cart-food-mobile/cart-food-mobile'; 

const routes: Routes = [
  // ... (Las dos rutas de desktop y mobile se quedan igual)
  {
    path: '',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth >= 768],
    component: MenuFoodDesktop,
  },
  {
    path: '',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth < 768],
    component: MenuFoodMobile,
  },

  // ¡¡AQUÍ USAMOS EL COMPONENTE NUEVO!!
  {
    path: 'carrito',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth >= 768],
    component: CartFoodDesktop,
  },
  {
    path: 'carrito',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth < 768],
    component: CartFoodMobile,
  }
];

// ... (El resto del archivo se queda igual)
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo4RoutingModule { }