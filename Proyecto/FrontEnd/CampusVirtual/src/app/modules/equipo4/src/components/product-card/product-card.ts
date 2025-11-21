import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './product.model';

@Component({
  selector: 'app-product-card',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './product-card.html', 
  styleUrls: ['./product-card.css']   
})
export class ProductCard {
  @Input() product!: Product;

  agregarAlCarrito() {
    alert('Se agregó: ' + this.product.name);
  }
}