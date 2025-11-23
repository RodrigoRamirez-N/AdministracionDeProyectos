import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-carrito-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-item.html',
  styleUrls: ['./carrito-item.css']
})
export class CarritoItem {
  @Input() product: any; 
  
  // Inputs para compatibilidad
  @Input() id!: number; // Nuevo input para ID explícito
  @Input() title: string = '';
  @Input() price: any = 0;
  @Input() quantity: number = 1;
  @Input() imageUrl: string = '';

  @Output() change = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  private getId(): number {
    return this.id || (this.product ? this.product.id : 0);
  }

  aumentar() {
    this.cartService.updateQuantity(this.getId(), 1);
    this.change.emit();
  }

  disminuir() {
    // El servicio ya valida que no baje de 1
    this.cartService.updateQuantity(this.getId(), -1);
    this.change.emit();
  }

  eliminar() {
    this.cartService.removeItem(this.getId());
    this.change.emit();
  }
}