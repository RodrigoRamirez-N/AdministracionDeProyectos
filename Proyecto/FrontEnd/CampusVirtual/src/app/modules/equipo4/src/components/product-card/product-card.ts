import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem } from '../../services/equipo4-api.service'; 
import { CartService } from '../../services/cart.service.';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html', // Asegúrate que el nombre sea correcto
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() food!: FoodItem;
  @Output() added = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  addToCart() {
    // Convertimos los datos
    const productToCart = {
      id: this.food.id,
      name: this.food.name,
      place: this.food.description, 
      price: Number(this.food.price), 
      image_url: this.food.image_url,
      likes: this.food.rating,
      quantity: 1
    };

    // Guardamos
    this.cartService.addToCart(productToCart);
    
    // Avisamos
    this.added.emit();
    alert('Se agregó: ' + this.food.name);
  }
}