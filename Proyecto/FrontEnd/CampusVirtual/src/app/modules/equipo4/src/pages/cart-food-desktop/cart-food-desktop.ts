import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service'; // Importar servicio

const API_BASE = 'http://localhost:8000/api/equipo4';

interface CartItem { id: number; title: string; price: number; quantity: number; imageUrl?: string; standId: number; standName: string; }
interface CartGroup { standId: number; standName: string; items: CartItem[]; subtotal: number; itemCount: number; }

@Component({
  selector: 'app-cart-food-desktop',
  standalone: true,
  imports: [ 
    CommonModule,
    CarritoItem, 
    CarritoSummary,
    RouterModule
  ], 
  templateUrl: './cart-food-desktop.html', 
  styleUrls: ['./cart-food-desktop.css'] 
})

export class CartFoodDesktop implements OnInit { 
  items: CartItem[] = [];
  groups: CartGroup[] = [];
  selectedCount = 0;
  shipping = 25;
  get subtotal(): number {
    return this.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }
  get itemsCount(): number {
    return this.items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
  }

  constructor(private cartService: CartService, private router: Router) {} // Inyectar servicio y router

  async ngOnInit() {
    // 1. Intentar cargar del servicio
    let rawItems = this.cartService.getItems();

    // 2. Si está vacío, cargar mocks
    if (rawItems.length === 0) {
      await this.loadCartFromApi();
      rawItems = this.cartService.getItems(); // Recargar después de guardar mocks
    }

    this.loadCart(); // Procesar items para la vista
    window.addEventListener('storage', () => this.loadCart());
  }

  private async loadCartFromApi() {
    try {
      const [ordersRes, orderItemsRes, foodsRes, standsRes] = await Promise.all([
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/order-items`),
        fetch(`${API_BASE}/foods`),
        fetch(`${API_BASE}/food-stands`)
      ]);

      if (!ordersRes.ok || !orderItemsRes.ok || !foodsRes.ok || !standsRes.ok) return;

      const orders: any[] = await ordersRes.json();
      const order = Array.isArray(orders) && orders.length ? orders[0] : null;
      const orderItems: any[] = await orderItemsRes.json();
      const foods: any[] = await foodsRes.json();
      const stands: any[] = await standsRes.json();

      const foodById = new Map<number, any>(foods.map(f => [Number(f.id), f]));
      const standById = new Map<number, string>(stands.map(s => [Number(s.id), String(s.name)]));

      // Filtramos items de la orden de ejemplo
      const filteredItems = order ? orderItems.filter(oi => Number(oi.order_id) === Number(order.id)) : orderItems;

      // Convertimos y guardamos en el servicio uno por uno
      filteredItems.forEach(oi => {
        const f = foodById.get(Number(oi.food_id));
        if (f) {
          const productToCart = {
            id: Number(f.id),
            name: f.name,
            place: f.description,
            price: Number(f.price),
            image_url: f.image_url,
            likes: f.rating,
            quantity: Number(oi.quantity || 1),
            standId: Number(f.food_stand_id),
            standName: standById.get(Number(f.food_stand_id)) || 'Puesto'
          };
          // Usamos addToCart para aprovechar la lógica de guardado
          // Nota: addToCart suma cantidad si ya existe, aquí asumimos array vacío al inicio
          this.cartService.addToCart(productToCart);
        }
      });

    } catch (e) {
      console.error('Error cargando datos desde API equipo4', e);
    }
  }

  public loadCart() {
    const rawItems = this.cartService.getItems();
    
    // Mapear de formato del servicio a formato interno CartItem
    this.items = rawItems.map((i: any) => ({
      id: i.id,
      title: i.name || i.title,
      price: Number(i.price),
      quantity: Number(i.quantity) || 1, // Asegurar número
      imageUrl: i.image_url || i.imageUrl || '',
      standId: i.standId || 0,
      standName: i.standName || 'Puesto'
    }));

    this.buildGroups();
    this.selectedCount = this.itemsCount;
    console.log('Cart loaded:', this.items, 'Count:', this.selectedCount);
  }

  private buildGroups() {
    const map = new Map<number, CartGroup>();
    for (const it of this.items) {
      const g = map.get(it.standId);
      if (!g) {
        map.set(it.standId, {
          standId: it.standId,
          standName: it.standName,
          items: [it],
          subtotal: it.price * it.quantity,
          itemCount: it.quantity
        });
      } else {
        g.items.push(it);
        g.subtotal += it.price * it.quantity;
        g.itemCount += it.quantity;
      }
    }
    this.groups = Array.from(map.values());
  }

  async finalizarPedidos() {
    if (!this.items.length) return;
    const before = this.cartService.getItems().length;
    try {
      await this.cartService.checkout();
      alert(before ? 'Pedidos generados por puesto.' : 'Sin elementos.');
      this.loadCart();
      this.router.navigate(['/equipo4/pedidos']);
    } catch (e) {
      alert('No se pudieron generar los pedidos. Revisa el servidor.');
      console.error(e);
    }
  }
}