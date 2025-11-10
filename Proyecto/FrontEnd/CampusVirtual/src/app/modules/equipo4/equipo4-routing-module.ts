import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuFoodDesktop } from './src/pages/menu-food-desktop/menu-food-desktop';
import { MenuFoodMobile } from './src/pages/menu-food-mobile/menu-food-mobile';

// ¡¡AQUÍ IMPORTAMOS LA PÁGINA NUEVA CON EL NOMBRE CORRECTO!!
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
    component: CartFoodMobile, // <-- El nombre que te dijo tu compañero
  }
];

// ... (El resto del archivo se queda igual)
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo4RoutingModule { }