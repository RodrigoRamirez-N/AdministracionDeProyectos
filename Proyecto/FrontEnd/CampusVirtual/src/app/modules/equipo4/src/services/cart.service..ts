import { Injectable } from '@angular/core';
import { Product } from '../components/product-card/product.model'; // Asegúrate que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];

  constructor() { }

 

  addToCart(product: Product) {
    // Buscamos si el producto YA existe en el carrito
    const existingProduct = this.items.find(item => item.id === product.id);

    if (existingProduct) {
      // Si ya existe, solo le sumamos 1 a la cantidad
      if (existingProduct.quantity) {
        existingProduct.quantity++;
      }
    } else {
      // Si es nuevo, le ponemos cantidad 1 y lo agregamos
      product.quantity = 1;
      this.items.push(product);
    }
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
  // ... dentro de la clase CartService

  // Función para eliminar un producto por su ID
  removeItem(productId: number) {
    // Filtramos la lista para quedarnos con todos MENOS el que queremos borrar
    this.items = this.items.filter(item => item.id !== productId);
  }
}