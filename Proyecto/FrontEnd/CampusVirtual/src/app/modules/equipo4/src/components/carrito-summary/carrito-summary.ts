import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() items: Product[] = [];
  @Input() subtotal: number = 0;
  @Input() itemsCount: number = 0;
  
  // ¡RECUPERAMOS ESTO PARA QUE DESKTOP NO FALLE!
  @Input() shipping: number = 25; 

  @Output() checkout = new EventEmitter<void>();

  // Forzamos único tipo: recoger en tienda
  deliveryType: 'pickup' = 'pickup'; 

  // --- CÁLCULOS ---
  
  get displayCount(): number {
    return this.items.length > 0 ? this.items.length : this.itemsCount;
  }

  get displaySubtotal(): number {
    if (this.items.length > 0) {
      return this.items.reduce((suma, item) => suma + (item.price * (item.quantity || 1)), 0);
    }
    return this.subtotal;
  }

  // Ya no necesitamos 'currentShipping', usamos 'shipping' directo
  
  get displayTotal(): number {
    // Sumamos el subtotal + el envío (que puede ser input o calculado)
    return this.displaySubtotal + this.shipping;
  }

  // --- LÓGICA DEL SELECTOR (MOBILE) ---
  // Desactivamos selección: siempre pickup (envío 0)
  setDeliveryType(_type: 'delivery' | 'pickup') {
    this.deliveryType = 'pickup';
    this.shipping = 0;
  }

  onCheckout() {
    this.checkout.emit();
  }
}