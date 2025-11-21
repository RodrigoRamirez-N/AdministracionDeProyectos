import { Component, Input } from '@angular/core';
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
  // --- TU FORMA (MOBILE) ---
  @Input() product: Product | undefined;

  // --- LA FORMA DE TU COMPAÑERO (DESKTOP) ---
  // Agregamos esto para que su código no falle
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() quantity: number = 1;
  @Input() imageUrl: string = '';
}