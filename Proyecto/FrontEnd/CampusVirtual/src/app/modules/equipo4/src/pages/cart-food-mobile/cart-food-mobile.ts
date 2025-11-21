import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
import { Product } from '../../components/product-card/product.model';
import { CartService } from '../../services/cart.service.'; 

@Component({
  selector: 'app-cart-food-mobile',
  standalone: true,
  imports: [ 
    CommonModule, 
    CarritoItem, 
    CarritoSummary,
    RouterModule 
  ], 
  templateUrl: './cart-food-mobile.html', 
  styleUrls: ['./cart-food-mobile.css'] 
})
// ... imports ...

export class CartFoodMobile implements OnInit {
  cartItems: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
  }

  // ESTA ES LA FUNCIÓN NUEVA
  borrarItem(item: Product) {
    // 1. Borra del servicio
    this.cartService.removeItem(item.id);
    // 2. Actualiza la lista local para que se vea el cambio
    this.cartItems = this.cartService.getItems();
  }
}