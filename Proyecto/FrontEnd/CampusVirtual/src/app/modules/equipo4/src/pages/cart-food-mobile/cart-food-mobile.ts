import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
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
export class CartFoodMobile implements OnInit {
  
  cartItems: any[] = [];

  constructor(
    private cartService: CartService, // Ahora sí sabrá qué es esto
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    window.addEventListener('storage', () => this.loadCart());
  }

  loadCart() {
    this.cartItems = this.cartService.getItems();
  }

  actualizarCarrito() {
    this.loadCart();
  }


  // Debe recibir 'tipo' (o el nombre que quieras)
  finalizarPedido(tipo: string) { 
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // ¡IMPORTANTE! Debes pasarle ese 'tipo' al servicio
    this.cartService.checkout(tipo); 
    
    alert('¡Pedido realizado con éxito!');
    this.router.navigate(['/equipo4/pedidos']);
  }
  
  
}