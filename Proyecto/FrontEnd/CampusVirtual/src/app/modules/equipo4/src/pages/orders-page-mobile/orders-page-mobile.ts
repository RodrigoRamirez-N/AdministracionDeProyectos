import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Equipo4ApiService, Order } from '../../services/equipo4-api.service';

@Component({
  selector: 'app-orders-page-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-page-mobile.html',
  styleUrls: ['./orders-page-mobile.css']
})
export class OrdersPageMobile implements OnInit {
  
  orders: any[] = []; // Usamos 'any' para evitar peleas de tipos entre local y API
  isLoading: boolean = true;

  constructor(private apiService: Equipo4ApiService) {}
// ... dentro de la clase OrdersPageMobile ...

  toggleDetails(order: any) {
    // Esto invierte el valor: si es false se vuelve true, y viceversa
    order.showDetails = !order.showDetails;
  }
  ngOnInit() {
    // 1. Cargar órdenes LOCALES (Las que hiciste con "Finalizar Pedido")
    const localOrders = JSON.parse(localStorage.getItem('equipo4_orders') || '[]');
    
    // 2. Pedir órdenes de la API (Las del sistema)
    this.apiService.getOrders().subscribe({
      next: (apiData) => {
        // COMBINAMOS TODO: Primero las locales (más nuevas), luego las de la API
        // Usamos .reverse() en las locales para que la última salga hasta arriba
        this.orders = [...localOrders.reverse(), ...apiData];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error trayendo ordenes, mostrando solo locales', err);
        // Si falla la API, mostramos al menos las locales
        this.orders = localOrders.reverse();
        
        // Si no hay locales tampoco, ponemos unos de prueba para que no se vea feo
        if (this.orders.length === 0) {
           this.orders = [
            { id: 999, type: 'Ejemplo API Caída', status: 'cancelled', created_at: 'Hoy' }
           ];
        }
        this.isLoading = false;
      }
    });
  }
}