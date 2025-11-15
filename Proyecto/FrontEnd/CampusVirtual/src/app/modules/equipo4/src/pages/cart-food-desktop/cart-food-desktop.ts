import { Component } from '@angular/core';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
import { RouterModule } from '@angular/router'; // <-- LÍNEA IMPORTANTE 1

@Component({
  selector: 'app-cart-food-desktop',
  standalone: true,
  imports: [ 
    CarritoItem, 
    CarritoSummary,
    RouterModule // <-- LÍNEA IMPORTANTE 2
  ], 
  templateUrl: './cart-food-desktop.html', 
  styleUrls: ['./cart-food-desktop.css'] 
})
export class CartFoodDesktop { 
}