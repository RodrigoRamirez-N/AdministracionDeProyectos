import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product-card/product.model';

@Component({
  selector: 'app-carrito-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-summary.html',
  styleUrls: ['./carrito-summary.css']
})
export class CarritoSummary {
  // --- MODO MOBILE (Lista de productos) ---
  @Input() items: Product[] = [];

  // --- MODO DESKTOP (Valores directos) ---
  @Input() subtotal: number = 0;
  @Input() shipping: number = 25; // Valor por defecto
  @Input() itemsCount: number = 0;

  // --- CÁLCULOS INTELIGENTES ---
  
  // 1. Calcula cuántos items hay (usando la lista O el número directo)
  get displayCount(): number {
    return this.items.length > 0 ? this.items.length : this.itemsCount;
  }

  // 2. Calcula el subtotal (sumando la lista O usando el valor directo)

  get displaySubtotal(): number {
    if (this.items.length > 0) {
      // AHORA MULTIPLICAMOS EL PRECIO POR LA CANTIDAD
      return this.items.reduce((suma, item) => suma + (item.price * (item.quantity || 1)), 0);
    }
    return this.subtotal;
  }
  
  // 3. Calcula el total final
  get displayTotal(): number {
    return this.displaySubtotal + this.shipping;
  }
}