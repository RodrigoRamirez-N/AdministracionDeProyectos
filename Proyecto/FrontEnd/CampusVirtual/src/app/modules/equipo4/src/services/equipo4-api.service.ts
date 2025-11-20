// Servicio de API del equipo4 activo. Usa HttpClient. Si tu backend corre en otro host, ajusta BASE.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces alineadas al README
export interface FoodStand {
  id: number; name: string; description: string; telephone: string; available: boolean;
}
export interface OpeningHour {
  id: number; food_stand_id: number; opening_time: string; closing_time: string; available_days: string;
}
export interface FoodItem {
  id: number; food_stand_id: number; name: string; description: string; price: string; rating: number; image_url: string;
}
export interface PaymentMethod { id: number; method: string; }
export interface Order {
  id: number; food_stand_id: number; payment_method_id: number; type: string; instructions: string; status: string; created_at: string;
}
export interface CreateOrderBody {
  food_stand_id: number; payment_method_id: number; type?: string; instructions?: string; status?: string;
}
export interface OrderItem { id: number; order_id: number; food_id: number; quantity: number; }
export interface CreateOrderItemBody { order_id: number; food_id: number; quantity?: number; }

const BASE = '/api/equipo4';

@Injectable({ providedIn: 'root' })
export class Equipo4ApiService {
  constructor(private http: HttpClient) {}

  // Puestos de comida
  getFoodStands(): Observable<FoodStand[]> {
    return this.http.get<FoodStand[]>(`${BASE}/food-stands`);
  }
  getFoodStand(id: number): Observable<FoodStand> {
    return this.http.get<FoodStand>(`${BASE}/food-stands/${id}`);
  }

  // Horarios
  getOpeningHours(food_stand_id?: number): Observable<OpeningHour[]> {
    const url = food_stand_id != null ? `${BASE}/opening-hours?food_stand_id=${food_stand_id}` : `${BASE}/opening-hours`;
    return this.http.get<OpeningHour[]>(url);
  }
  getOpeningHour(id: number): Observable<OpeningHour> {
    return this.http.get<OpeningHour>(`${BASE}/opening-hours/${id}`);
  }

  // Comidas
  getFoods(food_stand_id?: number): Observable<FoodItem[]> {
    const url = food_stand_id != null ? `${BASE}/foods?food_stand_id=${food_stand_id}` : `${BASE}/foods`;
    return this.http.get<FoodItem[]>(url);
  }
  getFood(id: number): Observable<FoodItem> {
    return this.http.get<FoodItem>(`${BASE}/foods/${id}`);
  }

  // Métodos de pago
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${BASE}/payment-methods`);
  }
  getPaymentMethod(id: number): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${BASE}/payment-methods/${id}`);
  }

  // Órdenes
  getOrders(params?: { status?: string; food_stand_id?: number }): Observable<Order[]> {
    const q: string[] = [];
    if (params?.status) q.push(`status=${encodeURIComponent(params.status)}`);
    if (params?.food_stand_id != null) q.push(`food_stand_id=${params.food_stand_id}`);
    const url = q.length ? `${BASE}/orders?${q.join('&')}` : `${BASE}/orders`;
    return this.http.get<Order[]>(url);
  }
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${BASE}/orders/${id}`);
  }
  createOrder(body: CreateOrderBody): Observable<Order> {
    return this.http.post<Order>(`${BASE}/orders`, body);
  }

  // Artículos de la orden
  getOrderItems(params?: { order_id?: number; food_id?: number }): Observable<OrderItem[]> {
    const q: string[] = [];
    if (params?.order_id != null) q.push(`order_id=${params.order_id}`);
    if (params?.food_id != null) q.push(`food_id=${params.food_id}`);
    const url = q.length ? `${BASE}/order-items?${q.join('&')}` : `${BASE}/order-items`;
    return this.http.get<OrderItem[]>(url);
  }
  getOrderItem(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${BASE}/order-items/${id}`);
  }
  createOrderItem(body: CreateOrderItemBody): Observable<OrderItem> {
    return this.http.post<OrderItem>(`${BASE}/order-items`, body);
  }
}

// Alternativa rápida con fetch (comentada). Descomenta si prefieres no usar HttpClient.
/*
export async function fetchFoodStands(): Promise<FoodStand[]> {
  const r = await fetch('/api/equipo4/food-stands');
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

export async function fetchFoods(food_stand_id?: number): Promise<FoodItem[]> {
  const url = food_stand_id != null ? `/api/equipo4/foods?food_stand_id=${food_stand_id}` : '/api/equipo4/foods';
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

export async function createOrderFetch(body: CreateOrderBody): Promise<Order> {
  const r = await fetch('/api/equipo4/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

export async function createOrderItemFetch(body: CreateOrderItemBody): Promise<OrderItem> {
  const r = await fetch('/api/equipo4/order-items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
*/

// Guía de activación rápida:
// - Para HttpClient: descomenta todo el bloque superior y añade HttpClientModule.
// - Para fetch: descomenta sólo las funciones necesarias.
// - Reemplaza BASE si tu backend corre en otro origin (ej: http://localhost:3000/api/equipo4).
