import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header/app-header';
import { ProductGridComponent, ProductItem } from './components/product-grid/product-grid';
import { LocationBannerComponent } from './components/location-banner/location-banner';
import { LocationFilterComponent } from './components/location-filter/location-filter';

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
      standId: Number(f.food_stand_id)
    }));
  }

  async ngOnInit() {
    await Promise.all([
      this.loadFoodStands(),
      this.loadFoods()
    ]);
    this.refreshCartCount();
  }

  private async loadFoodStands() {
    try {
      const res = await fetch('/mock/equipo4/food-stands.json');
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
      const res = await fetch('/mock/equipo4/foods.json');
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

  onAddProduct(ev: { id: string | number; standId: number | null }) {
    const idNum = Number(ev.id);
    if (!Number.isFinite(idNum)) return;
    const key = 'equipo4_cart_items';
    const raw = localStorage.getItem(key);
    let data: Record<string, number> = {};
    if (raw) {
      try { data = JSON.parse(raw) || {}; } catch { data = {}; }
    }
    data[idNum] = (data[idNum] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
    this.refreshCartCount();
  }

  private refreshCartCount() {
    const key = 'equipo4_cart_items';
    const raw = localStorage.getItem(key);
    if (!raw) { this.cartCount = 0; return; }
    try {
      const data = JSON.parse(raw) as Record<string, number>;
      this.cartCount = Object.values(data).reduce((a, b) => a + b, 0);
    } catch {
      this.cartCount = 0;
    }
  }
}
