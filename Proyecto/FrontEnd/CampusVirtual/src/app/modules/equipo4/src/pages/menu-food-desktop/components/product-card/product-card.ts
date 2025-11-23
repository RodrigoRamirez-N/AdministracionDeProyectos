import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// Ajuste de ruta: este componente está en pages/menu-food-desktop/components/product-card
// Para llegar a services: subir 4 niveles hasta src y luego entrar a services
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {
  @Input() title = 'Platillo';
  @Input() price = 0;
  // URL por defecto usada como fallback
  @Input() imageUrl = 'https://media.gq.com.mx/photos/649391b89ec62ce6c5b091a5/16:9/w_2240,c_limit/mejores-hamburguesas.jpg';
  @Input() description = '';
  // Identificador interno del producto (opcional para manejo de carrito)
  @Input() productId: string | number = '';
  @Input() standId: number | null = null;
  @Input() standName: string = 'Puesto';
  @Output() added = new EventEmitter<void>();

  // Mantener la misma URL por defecto en una propiedad dedicada
  defaultImageUrl = 'https://media.gq.com.mx/photos/649391b89ec62ce6c5b091a5/16:9/w_2240,c_limit/mejores-hamburguesas.jpg';

  // Getter que devuelve la URL efectiva de la imagen, usando fallback si imageUrl está vacío o es sólo espacios
  get imageSrc(): string {
    if (this.imageUrl == null) return this.defaultImageUrl;
    const trimmed = String(this.imageUrl).trim();
    return trimmed ? trimmed : this.defaultImageUrl;
  }

  // Si la carga de la imagen falla, sustituimos por la imagen por defecto
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;
    // Evitamos bucles infinitos si la imagen por defecto también falla
    if (img.src !== this.defaultImageUrl) img.src = this.defaultImageUrl;
  }

  constructor(private cartService: CartService) {}

  onAddClick() {
    // Construimos objeto estándar para el carrito
    const productToCart = {
      id: Number(this.productId),
      name: this.title,
      place: this.description,
      price: Number(this.price),
      image_url: this.imageUrl,
      likes: 0,
      quantity: 1,
      standId: this.standId ?? 0,
      standName: this.standName || 'Puesto'
    };
    this.cartService.addToCart(productToCart);
    this.added.emit();
  }
}
