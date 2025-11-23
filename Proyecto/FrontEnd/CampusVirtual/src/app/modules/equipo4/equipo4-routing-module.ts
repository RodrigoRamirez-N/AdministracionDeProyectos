import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuFoodDesktop } from './src/pages/menu-food-desktop/menu-food-desktop';
import { MenuFoodMobile } from './src/pages/menu-food-mobile/menu-food-mobile';
import { CartFoodDesktop } from './src/pages/cart-food-desktop/cart-food-desktop';
import { CartFoodMobile } from './src/pages/cart-food-mobile/cart-food-mobile'; 

import { OrdersPageMobile } from './src/pages/orders-page-mobile/orders-page-mobile';
import { OrdersPageDesktop } from './src/pages/orders-page-desktop/orders-page-desktop';

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
  },
  {
    path: 'carrito',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth >= 768],
    component: CartFoodDesktop,
  },
  {
    path: 'carrito',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth < 768],
    component: CartFoodMobile,
  },

  
  {
    path: 'pedidos',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth >= 768],
    component: OrdersPageDesktop,
  },
  {
    path: 'pedidos',
    canMatch: [() => typeof window !== 'undefined' && window.innerWidth < 768],
    component: OrdersPageMobile,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Equipo4RoutingModule { }