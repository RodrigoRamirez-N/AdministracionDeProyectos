import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-item.html',
  styleUrl: './carrito-item.css'
})
export class CarritoItem {
  @Input() title: string = 'Producto';
  @Input() price: number = 0;
  @Input() quantity: number = 1;
  @Input() imageUrl: string = 'https://via.placeholder.com/120x120.png?text=Item';
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  onPlus() { this.increment.emit(); }
  onMinus() { this.decrement.emit(); }
  onRemove() { this.remove.emit(); }

}
