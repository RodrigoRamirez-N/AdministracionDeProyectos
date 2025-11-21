import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
import { Product } from '../../components/product-card/product.model';

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
export class CartFoodMobile {
  // Simulamos que el usuario agregó estas 2 cosas
  cartItems: Product[] = [
    {
      id: 1,
      name: 'Hamburguesa Clásica',
      place: 'Cafetería Central',
      price: 100,
      image: 'assets/images/Recetas-de-Hamburguesa.jpg',
      likes: 0
    },
    {
      id: 4,
      name: 'Refresco Grande',
      place: 'El Punto',
      price: 25,
      image: 'assets/images/Recetas-de-Hamburguesa.jpg', // Usa la imagen que tengas
      likes: 0
    }
  ];
}