import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header/app-header';
import { ProductGridComponent, ProductItem } from './components/product-grid/product-grid';
import { LocationBannerComponent } from './components/location-banner/location-banner';
import { LocationFilterComponent } from './components/location-filter/location-filter';
import { CartService } from '../../services/cart.service'; // Importar servicio

const API_BASE = 'http://localhost:8000/api/equipo4';

@Component({
  selector: 'app-menu-food-desktop',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    ProductGridComponent,
    LocationBannerComponent,
    LocationFilterComponent
  ],
  templateUrl: './menu-food-desktop.html',
  styleUrl: './menu-food-desktop.css'
})
export class MenuFoodDesktop implements OnInit {
  selectedLocation = 'Todos';
  cartCount = 0;
  hasOrders = false;

  locations: string[] = ['Todos'];
  private standsById = new Map<number, string>();
  private rawFoods: Array<{
    id: number;
    food_stand_id: number;
    name: string;
    description?: string;
    price: string;
    rating?: number;
    image_url?: string;
  }> = [];

  get displayProducts(): ProductItem[] {
    const list = this.selectedLocation === 'Todos'
      ? this.rawFoods
      : this.rawFoods.filter(f => this.standsById.get(Number(f.food_stand_id)) === this.selectedLocation);
    return list.map<ProductItem>(f => ({
      id: String(f.id),
      title: f.name,
      price: Number(f.price),
      imageUrl: f.image_url || '',
      description: f.description || '',
      standId: Number(f.food_stand_id),
      standName: this.standsById.get(Number(f.food_stand_id)) || 'Puesto'
    }));
  }

  constructor(private cartService: CartService) {} // Inyectar servicio

  async ngOnInit() {
    await Promise.all([
      this.loadFoodStands(),
      this.loadFoods()
    ]);
    this.refreshCartCount();
    this.refreshOrdersFlag();
    // Escuchar cambios para actualizar el contador
    window.addEventListener('storage', () => { this.refreshCartCount(); this.refreshOrdersFlag(); });
  }

  private async loadFoodStands() {
    try {
      const res = await fetch(`${API_BASE}/food-stands`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const stands: Array<{ id: number; name: string } & Record<string, unknown>> = await res.json();
      this.standsById.clear();
      for (const s of stands) this.standsById.set(Number(s.id), String(s.name));
      const names = stands.map(s => String(s.name)).filter(n => n && n.trim().length);
      const unique = Array.from(new Set(names));
      this.locations = ['Todos', ...unique];
      if (!this.locations.includes(this.selectedLocation)) this.selectedLocation = 'Todos';
    } catch (e) {
      console.error('No se pudieron cargar puestos, usando valores por defecto.', e);
      this.locations = ['Todos', 'El Punto', 'Facultad de Ingeniería', 'Facultad de Música'];
      this.standsById = new Map<number, string>([
        [1, 'El Punto'],
        [2, 'Facultad de Ingeniería'],
        [3, 'Facultad de Música']
      ]);
    }
  }

  private async loadFoods() {
    try {
      const res = await fetch(`${API_BASE}/foods`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const foods = await res.json();
      if (Array.isArray(foods)) this.rawFoods = foods as any[];
    } catch (e) {
      console.error('No se pudieron cargar alimentos, usando valores de ejemplo.', e);
      this.rawFoods = [
        { id: 1, food_stand_id: 1, name: 'Chilaquiles', description: 'Con pollo y salsa verde', price: '85' },
        { id: 2, food_stand_id: 1, name: 'Hamburguesa', description: 'Clásica con queso', price: '95' }
      ];
    }
  }

  // La lógica de agregar al carrito ahora vive dentro del ProductCardComponent.
  // Este método ya no es necesario y se ha removido.

  refreshCartCount() {
    const items = this.cartService.getItems();
    this.cartCount = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0);
  }

  refreshOrdersFlag() {
    // Primero intentar API real; si falla, degradar a flag local.
    fetch(`${API_BASE}/orders`).then(async r => {
      if (!r.ok) throw new Error();
      const data = await r.json();
      this.hasOrders = Array.isArray(data) && data.length > 0;
    }).catch(() => {
      // Fallback: usar flag simple si se guardó tras checkout
      const flag = localStorage.getItem('equipo4_has_orders');
      this.hasOrders = flag === 'true';
    });
  }
}
