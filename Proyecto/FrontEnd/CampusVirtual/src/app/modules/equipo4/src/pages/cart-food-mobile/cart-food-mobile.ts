import { Component } from '@angular/core';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';

@Component({
  selector: 'app-cart-food-mobile',
  standalone: true,
  imports: [ CarritoItem, CarritoSummary ], 
  templateUrl: './cart-food-mobile.html', 
  styleUrls: ['./cart-food-mobile.css']   
})
export class CartFoodMobile { 
}