import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Equipo4ApiService, Order } from '../../services/equipo4-api.service';
// Tipado extendido de orden enriquecida (mover antes del decorador para no romperlo)
interface ExtendedOrder extends Order {
  items?: { food_id: number; quantity: number; name: string; price: number }[];
  total?: number;
  standName?: string;
  showDetails?: boolean;
}
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orders-page-desktop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-page-desktop.html',
  styleUrls: ['./orders-page-desktop.css']
})
export class OrdersPageDesktop implements OnInit {
  
  orders: ExtendedOrder[] = [];
  isLoading: boolean = true;
  completing = false;
  get hasPending(): boolean { return this.orders.some((o: ExtendedOrder) => o && o.status !== 'completed'); }

  constructor(private apiService: Equipo4ApiService) {}

  ngOnInit() {
    console.debug('[OrdersDesktop] init');
    this.apiService.getOrders().subscribe({
      next: (apiOrdersRaw) => {
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
            const apiOrders: ExtendedOrder[] = (apiOrdersRaw || []).map((o: any) => {
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
            this.orders = apiOrders.filter((o: ExtendedOrder) => o && o.status !== 'completed');
            console.debug('[OrdersDesktop] loaded orders', this.orders.length);
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error enriqueciendo órdenes (desktop)', err);
            const apiOrders: ExtendedOrder[] = (apiOrdersRaw || []).map((o: any) => ({
              ...o,
              food_stand_id: o.food_stand_id ?? 0,
              payment_method_id: o.payment_method_id ?? 0,
              instructions: o.instructions ?? '',
              standName: 'Puesto'
            }));
            this.orders = apiOrders.filter((o: ExtendedOrder) => o && o.status !== 'completed');
            console.debug('[OrdersDesktop] fallback orders', this.orders.length);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error trayendo órdenes API (desktop), solo locales', err);
        this.orders = [];
        console.debug('[OrdersDesktop] local only orders', this.orders.length);
        this.isLoading = false;
      }
    });
  }

  toggleDetails(order: any) {
    order.showDetails = !order.showDetails;
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
          console.debug('[OrdersDesktop] completada orden', o.id);
        } catch (e) {
          console.warn('No se pudo completar orden', o.id, e);
        }
      }
    } finally {
      this.completing = false;
      console.debug('[OrdersDesktop] proceso completar terminado');
    }
  }
}
