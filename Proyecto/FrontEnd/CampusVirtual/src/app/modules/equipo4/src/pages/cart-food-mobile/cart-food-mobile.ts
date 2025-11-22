import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
import { CartService } from '../../services/cart.service';



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
  groups: Array<{ standId: number; standName: string; items: any[]; subtotal: number; itemCount: number }> = [];
  shipping = 0; // Siempre recoger en tienda

  constructor(
    private cartService: CartService, // Ahora sí sabrá qué es esto
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    window.addEventListener('storage', () => this.loadCart());
  }

  loadCart() {
    this.cartItems = this.cartService.getItems().map(i => ({
      ...i,
      standId: i.standId || 0,
      standName: i.standName || 'Puesto'
    }));
    this.buildGroups();
  }

  actualizarCarrito() {
    this.loadCart();
  }


  async finalizarPedido() { 
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    const before = this.cartService.getItems().length;
    try {
      await this.cartService.checkout();
      const created = before ? 'Pedidos generados por puesto.' : 'Sin elementos.';
      alert(created);
      this.router.navigate(['/equipo4/pedidos']);
    } catch (e) {
      alert('No se pudieron generar los pedidos. Revisa el servidor.');
      console.error(e);
    }
  }
  

  private buildGroups() {
    const map = new Map<number, { standId: number; standName: string; items: any[]; subtotal: number; itemCount: number }>();
    for (const it of this.cartItems) {
      const sid = Number(it.standId) || 0;
      const g = map.get(sid);
      if (!g) {
        map.set(sid, {
          standId: sid,
          standName: it.standName || 'Puesto',
          items: [it],
          subtotal: Number(it.price) * (Number(it.quantity) || 1),
          itemCount: Number(it.quantity) || 1
        });
      } else {
        g.items.push(it);
        g.subtotal += Number(it.price) * (Number(it.quantity) || 1);
        g.itemCount += Number(it.quantity) || 1;
      }
    }
    this.groups = Array.from(map.values());
  }
  
}