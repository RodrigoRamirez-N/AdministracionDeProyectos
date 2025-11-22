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
  selector: 'app-orders-page-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-page-mobile.html',
  styleUrls: ['./orders-page-mobile.css']
})
export class OrdersPageMobile implements OnInit {
  orders: ExtendedOrder[] = [];
  isLoading = true;
  completing = false;

  constructor(private apiService: Equipo4ApiService) {}

  toggleDetails(order: any) { order.showDetails = !order.showDetails; }

  ngOnInit() {
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
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error enriqueciendo órdenes', err);
            // Mostrar al menos órdenes crudas
            const apiOrders: ExtendedOrder[] = (apiOrdersRaw || []).map((o: any) => ({
              ...o,
              food_stand_id: o.food_stand_id ?? 0,
              payment_method_id: o.payment_method_id ?? 0,
              instructions: o.instructions ?? '',
              standName: 'Puesto'
            }));
            this.orders = apiOrders.filter((o: ExtendedOrder) => o && o.status !== 'completed');
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error trayendo órdenes API, solo locales', err);
        this.orders = [];
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