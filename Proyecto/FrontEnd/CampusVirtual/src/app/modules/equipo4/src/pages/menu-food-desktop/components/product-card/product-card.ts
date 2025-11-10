import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
