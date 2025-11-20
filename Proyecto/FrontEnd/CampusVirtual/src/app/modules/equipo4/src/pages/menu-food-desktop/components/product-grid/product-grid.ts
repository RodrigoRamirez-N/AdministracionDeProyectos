import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card';

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  standId?: number | null;
}

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGridComponent {
  @Input() products: ProductItem[] = [
    { id: '1', title: 'Chilaquiles', price: 85, description: 'Con pollo y salsa verde' },
    { id: '2', title: 'Hamburguesa', price: 95, description: 'Clásica con queso' },
    { id: '3', title: 'Ensalada César', price: 70, description: 'Fresca y crujiente' },
    { id: '4', title: 'Tacos al pastor', price: 60, description: 'Orden de 4' },
    { id: '5', title: 'Agua de horchata', price: 25, description: 'Vaso 500ml' },
    { id: '6', title: 'Nachos', price: 65, description: 'Con queso y jalapeño' },
  ];
  @Output() addProduct = new EventEmitter<{ id: string | number; standId: number | null }>();

  onAdd(ev: { id: string | number; standId: number | null }) {
    this.addProduct.emit(ev);
  }
}
