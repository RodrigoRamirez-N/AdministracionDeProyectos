import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';

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
export class CartFoodMobile implements OnInit {
  
  cartItems: any[] = []; // Usamos 'any' para facilitar la transición

  constructor() {}

  ngOnInit() {
    this.loadCart();
    // Escuchar cambios si abres otra pestaña
    window.addEventListener('storage', () => this.loadCart());
  }

  loadCart() {
    // LEER DE LA MEMORIA DEL NAVEGADOR
    const data = localStorage.getItem('equipo4_cart_items');
    this.cartItems = data ? JSON.parse(data) : [];
  }

  // Función para recibir la orden de borrar desde el hijo
  actualizarCarrito() {
    this.loadCart(); // Recarga la lista desde la memoria
  }
}