import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoItem } from '../../components/carrito-item/carrito-item';
import { CarritoSummary } from '../../components/carrito-summary/carrito-summary';
import { RouterModule } from '@angular/router'; // <-- LÍNEA IMPORTANTE 1

// Interfaces declaradas antes del decorador para evitar error TS1206
interface CartItem { id: number; title: string; price: number; quantity: number; imageUrl?: string; standId: number; standName: string; }
interface CartGroup { standId: number; standName: string; items: CartItem[]; subtotal: number; itemCount: number; }

@Component({
  selector: 'app-cart-food-desktop',
  standalone: true,
  imports: [ 
    CommonModule,
    CarritoItem, 
    CarritoSummary,
    RouterModule // <-- LÍNEA IMPORTANTE 2
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
    return this.items.reduce((acc, it) => acc + it.quantity, 0);
  }

  async ngOnInit() {
    await this.loadCartFromMocks();
    this.refreshSelectedCount();
  }

  private async loadCartFromMocks() {
    try {
      const [ordersRes, orderItemsRes, foodsRes, standsRes] = await Promise.all([
        fetch('/mock/equipo4/orders.json'),
        fetch('/mock/equipo4/order-items.json'),
        fetch('/mock/equipo4/foods.json'),
        fetch('/mock/equipo4/food-stands.json')
      ]);
      if (!ordersRes.ok || !orderItemsRes.ok || !foodsRes.ok || !standsRes.ok) throw new Error('HTTP error cargando mocks');
      const orders: any[] = await ordersRes.json();
      const order = Array.isArray(orders) && orders.length ? orders[0] : null;
      const orderItems: any[] = await orderItemsRes.json();
      const foods: any[] = await foodsRes.json();
      const stands: any[] = await standsRes.json();
      const foodById = new Map<number, any>(foods.map(f => [Number(f.id), f]));
      const standById = new Map<number, string>(stands.map(s => [Number(s.id), String(s.name)]));
      // Si hay selección en localStorage, usarla como fuente principal.
      const lsRaw = localStorage.getItem('equipo4_cart_items');
      let lsData: Record<string, number> | null = null;
      if (lsRaw) {
        try { lsData = JSON.parse(lsRaw); } catch { lsData = null; }
      }
      if (lsData && Object.keys(lsData).length) {
        this.items = Object.entries(lsData).map(([foodId, qty]) => {
          const f = foodById.get(Number(foodId));
          return {
            id: Number(foodId),
            title: f ? String(f.name) : `Producto ${foodId}`,
            price: f ? Number(f.price) : 0,
            quantity: Number(qty) || 1,
            imageUrl: f?.image_url || '',
            standId: f ? Number(f.food_stand_id) : 0,
            standName: f ? (standById.get(Number(f.food_stand_id)) || 'Puesto') : 'Puesto'
          };
        });
      } else {
        const filteredItems = order ? orderItems.filter(oi => Number(oi.order_id) === Number(order.id)) : orderItems;
        this.items = filteredItems.map(oi => {
          const f = foodById.get(Number(oi.food_id));
          const price = f ? Number(f.price) : 0;
          return {
            id: Number(oi.id),
            title: f ? String(f.name) : `Producto ${oi.food_id}`,
            price,
            quantity: Number(oi.quantity ?? 1),
            imageUrl: f?.image_url || '',
            standId: f ? Number(f.food_stand_id) : 0,
            standName: f ? (standById.get(Number(f.food_stand_id)) || 'Puesto') : 'Puesto'
          };
        });
      }
      this.buildGroups();
    } catch (e) {
      console.error('Fallo al cargar carrito desde mocks, usando datos de ejemplo.', e);
      this.items = [
        { id: 1, title: 'Hamburguesa', price: 95, quantity: 1, imageUrl: '', standId: 1, standName: 'El Punto' },
        { id: 2, title: 'Chilaquiles', price: 85, quantity: 2, imageUrl: '', standId: 2, standName: 'Facultad de Ingeniería' }
      ];
      this.buildGroups();
    }
    this.refreshSelectedCount();
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

  private refreshSelectedCount() {
    const raw = localStorage.getItem('equipo4_cart_items');
    if (!raw) { this.selectedCount = 0; return; }
    try {
      const data = JSON.parse(raw) as Record<string, number>;
      this.selectedCount = Object.values(data).reduce((a,b)=>a+b,0);
    } catch { this.selectedCount = 0; }
  }

  // Actualiza localStorage según el estado actual de items
  private persistLocalStorage() {
    const payload: Record<string, number> = {};
    for (const it of this.items) {
      if (it.quantity > 0) payload[String(it.id)] = it.quantity;
    }
    localStorage.setItem('equipo4_cart_items', JSON.stringify(payload));
    this.refreshSelectedCount();
  }

  incrementItem(it: CartItem) {
    it.quantity += 1;
    this.recalculate();
  }

  decrementItem(it: CartItem) {
    if (it.quantity > 1) {
      it.quantity -= 1;
    } else {
      // Si llega a 1 y se decrementa, lo quitamos del carrito
      this.items = this.items.filter(x => x !== it);
    }
    this.recalculate();
  }

  private recalculate() {
    // Recalcular grupos y totales
    this.buildGroups();
    this.persistLocalStorage();
  }

  removeItem(it: CartItem) {
    this.items = this.items.filter(x => x !== it);
    this.recalculate();
  }
}