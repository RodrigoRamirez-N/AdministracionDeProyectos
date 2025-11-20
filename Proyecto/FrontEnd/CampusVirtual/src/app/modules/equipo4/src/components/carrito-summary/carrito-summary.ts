import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-summary.html',
  styleUrl: './carrito-summary.css'
})
export class CarritoSummary {
  @Input() subtotal: number = 0;
  @Input() shipping: number = 25;
  @Input() itemsCount: number = 0;
  get total(): number { return this.subtotal + this.shipping; }
}
