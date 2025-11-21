import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-item.html',
  styleUrls: ['./carrito-item.css']
})
export class CarritoItem {
  // Aceptamos 'any' para que funcione con los datos viejos y los nuevos
  @Input() product: any; 
  
  // Inputs para compatibilidad con Desktop (no los borres)
  @Input() title: string = '';
  @Input() price: any = 0;
  @Input() quantity: number = 1;
  @Input() imageUrl: string = '';

  // Evento para avisar al padre que algo cambió
  @Output() change = new EventEmitter<void>();

  // --- FUNCIONES QUE MODIFICAN EL LOCALSTORAGE ---

  aumentar() {
    this.updateQuantity(1);
  }

  disminuir() {
    this.updateQuantity(-1);
  }

  eliminar() {
    this.updateQuantity(0, true); // true significa "borrar completo"
  }

  private updateQuantity(change: number, deleteItem: boolean = false) {
    // 1. Leer carrito actual
    let cart = JSON.parse(localStorage.getItem('equipo4_cart_items') || '[]');
    
    // 2. Buscar este producto
    const index = cart.findIndex((item: any) => item.id === this.product.id);

    if (index !== -1) {
      if (deleteItem) {
        cart.splice(index, 1); // Borrar
      } else {
        cart[index].quantity = (cart[index].quantity || 1) + change;
        // Si baja a 0, borrarlo también
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }
      
      // 3. Guardar y avisar
      localStorage.setItem('equipo4_cart_items', JSON.stringify(cart));
      this.change.emit(); // Avisar al padre para que recargue
    }
  }
}