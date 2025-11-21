import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product-card/product.model';

@Component({
  selector: 'app-carrito-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-item.html',
  styleUrls: ['./carrito-item.css']
})
export class CarritoItem {
  // MODO MOBILE 
  @Input() product: Product | undefined;

  // MODO DESKTOP 
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() quantity: number = 1;
  @Input() imageUrl: string = '';

  @Output() remove = new EventEmitter<void>(); 

  // --- FUNCIONES PARA LOS BOTONES ---

  aumentar() {
    // Si estamos en modo Mobile (tenemos product)
    if (this.product) {
      if (this.product.quantity) {
        this.product.quantity++;
      } else {
        this.product.quantity = 1;
      }
    } else {
      // Si estamos en modo Desktop
      this.quantity++;
    }
  }

  disminuir() {
    // Si estamos en modo Mobile
    if (this.product) {
      if (this.product.quantity && this.product.quantity > 1) {
        this.product.quantity--;
      }
    } else {
      // Si estamos en modo Desktop
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  }

 
  eliminar() {
    this.remove.emit(); 
  }
}