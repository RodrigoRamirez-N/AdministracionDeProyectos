import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem } from '../../services/equipo4-api.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  // Recibimos el tipo de dato real
  @Input() food!: FoodItem;
  
  // Avisamos al padre cuando se agrega algo (para actualizar el badge)
  @Output() added = new EventEmitter<void>();

  addToCart() {
    // 1. Leer carrito actual
    let cart = JSON.parse(localStorage.getItem('equipo4_cart_items') || '[]');
    
    // 2. Buscar si ya existe este producto
    const existingItem = cart.find((item: any) => item.id === this.food.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Agregar nuevo con cantidad 1
      cart.push({ ...this.food, quantity: 1 });
    }

    // 3. Guardar en localStorage
    localStorage.setItem('equipo4_cart_items', JSON.stringify(cart));
    
    // 4. Avisar
    this.added.emit();
    alert('Se agregó: ' + this.food.name);
  }
}