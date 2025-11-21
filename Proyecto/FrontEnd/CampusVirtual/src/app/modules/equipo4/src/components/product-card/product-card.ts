import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './product.model';
import { CartService } from '../../services/cart.service.'; 

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  agregarAlCarrito() {
    this.cartService.addToCart(this.product);
    alert('Se agregó al carrito: ' + this.product.name);
  }
}