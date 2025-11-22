import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Equipo4ApiService, Order } from '../../services/equipo4-api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orders-page-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-page-mobile.html',
  styleUrls: ['./orders-page-mobile.css']
})
interface ExtendedOrder extends Order {
  items?: { food_id: number; quantity: number; name: string; price: number }[];
  total?: number;
  standName?: string;
  showDetails?: boolean;
}

export class OrdersPageMobile implements OnInit {
  orders: ExtendedOrder[] = [];
  isLoading = true;
  completing = false;

  constructor(private apiService: Equipo4ApiService) {}

  toggleDetails(order: any) { order.showDetails = !order.showDetails; }

  ngOnInit() {
    const localOrdersRaw = JSON.parse(localStorage.getItem('equipo4_orders') || '[]');
    const localOrders = localOrdersRaw.map((o: any) => ({
      ...o,
      standName: o.items && o.items.length ? (o.items[0].standName || 'Puesto') : 'Puesto'
    }));

    this.apiService.getOrders().subscribe({
      next: (apiOrdersRaw) => {
        // Paralelo: stands, foods, order-items para enriquecer
        forkJoin({
          stands: this.apiService.getFoodStands(),
          foods: this.apiService.getFoods(),
          orderItems: this.apiService.getOrderItems()
        }).subscribe({
          next: ({ stands, foods, orderItems }) => {
            const standsMap = new Map<number, string>(stands.map(s => [Number(s.id), String(s.name)]));
            const foodsMap = new Map<number, any>(foods.map(f => [Number(f.id), f]));
            const itemsByOrder = new Map<number, any[]>();
            for (const oi of orderItems) {
              const oid = Number(oi.order_id);
              const arr = itemsByOrder.get(oid);
              const food = foodsMap.get(Number(oi.food_id));
              const itemDetail = {
                food_id: Number(oi.food_id),
                quantity: Number(oi.quantity) || 1,
                name: food?.name || `Food ${oi.food_id}`,
                price: Number(food?.price) || 0
              };
              if (arr) arr.push(itemDetail); else itemsByOrder.set(oid, [itemDetail]);
            }

            const apiOrders = (apiOrdersRaw || []).map((o: any) => {
              const oid = Number(o.id);
              const items = itemsByOrder.get(oid) || [];
              const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
              return {
                ...o,
                items,
                total,
                standName: standsMap.get(Number(o.food_stand_id)) || 'Puesto'
              };
            });

            this.orders = [...localOrders.reverse(), ...apiOrders].filter((o: ExtendedOrder) => o && o.status !== 'completed');
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error enriqueciendo órdenes', err);
            // Mostrar al menos órdenes crudas
            const apiOrders = (apiOrdersRaw || []).map((o: any) => ({
              ...o,
              standName: 'Puesto'
            }));
            this.orders = [...localOrders.reverse(), ...apiOrders].filter((o: ExtendedOrder) => o && o.status !== 'completed');
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error trayendo órdenes API, solo locales', err);
        this.orders = localOrders.reverse().filter((o: ExtendedOrder) => o && o.status !== 'completed');
        if (this.orders.length === 0) {
          this.orders = [{ id: 999, type: 'Ejemplo API Caída', status: 'cancelled', created_at: 'Hoy' }];
        }
        this.isLoading = false;
      }
    });
  }

  async completeAllOrders() {
    if (this.completing) return;
    const target = this.orders.filter((o: ExtendedOrder) => o && o.id && o.status && o.status !== 'completed');
    if (!target.length) return;
    this.completing = true;
    try {
      for (const o of target) {
        try {
          const updated = await this.apiService.updateOrder(Number(o.id), { status: 'completed' });
          o.status = updated.status || 'completed';
        } catch (e) {
          console.warn('No se pudo completar orden', o.id, e);
        }
      }
    } finally {
      this.completing = false;
    }
  }
}