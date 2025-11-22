import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { Equipo4ApiService, FoodItem } from '../../services/equipo4-api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu-food-mobile',
  standalone: true,
  imports: [ CommonModule, ProductCard, RouterModule ],
  templateUrl: './menu-food-mobile.html',
  styleUrls: ['./menu-food-mobile.css']
})
export class MenuFoodMobile implements OnInit {
  
  // 1. Lista completa de alimentos
  foods: FoodItem[] = [
    // --- EL PUNTO (ID 1) ---
    {
      id: 1, food_stand_id: 1, name: 'Hamburguesa Clásica', description: 'Cafetería El Punto',
      price: '100', rating: 4, image_url: 'assets/images/Recetas-de-Hamburguesa.jpg'
    },
    {
      id: 2, food_stand_id: 1, name: 'Nachos con Queso', description: 'Totopos con queso',
      price: '65', rating: 5, image_url: 'assets/images/Nachos con queso.jpg'
    },
    {
      id: 3, food_stand_id: 1, name: 'Papas Fritas', description: 'Papas a la francesa',
      price: '45', rating: 4, image_url: 'assets/images/papas fritas.jpg'
    },
    // --- SISTEMAS (ID 2) ---
    {
      id: 4, food_stand_id: 2, name: 'Chilaquiles Verdes', description: 'Con pollo y crema',
      price: '85', rating: 5, image_url: 'assets/images/Chilaquiles verdes.jpg'
    },
    {
      id: 5, food_stand_id: 2, name: 'Tacos al Pastor (4)', description: 'Con piña',
      price: '60', rating: 5, image_url: 'assets/images/Tacos al pastor.png'
    },
    // --- MÚSICA (ID 3) ---
    {
      id: 6, food_stand_id: 3, name: 'Ensalada César', description: 'Lechuga y aderezo',
      price: '70', rating: 4, image_url: 'assets/images/Ensalada cesar.png'
    }
  ];

  // 2. Variables nuevas para el filtro
  displayedFoods: FoodItem[] = [];
  selectedCategory: number = 0; // 0 = Todos, otro = food_stand_id
  standFilters: Array<{ id: number; name: string }> = [
    { id: 0, name: 'Todos' }
  ];
  cartCount: number = 0;
  hasOrders: boolean = false;

  constructor(private apiService: Equipo4ApiService, private cartService: CartService) {}

  ngOnInit() {
    // Cargar stands para filtros dinámicos
    this.apiService.getFoodStands().subscribe({
      next: (stands) => {
        if (Array.isArray(stands) && stands.length) {
          const mapped = stands
            .map(s => ({ id: Number(s.id), name: String(s.name) }))
            .filter(s => !!s.name && !Number.isNaN(s.id));
          // Únicos por id
          const uniqueById = Array.from(new Map(mapped.map(s => [s.id, s])).values());
          this.standFilters = [{ id: 0, name: 'Todos' }, ...uniqueById];
        }
      },
      error: () => {
        // Si falla, mantenemos solo "Todos"
        this.standFilters = [{ id: 0, name: 'Todos' }];
      }
    });

    // Cargar alimentos desde API
    this.apiService.getFoods().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.foods = data;
          this.filterFoods(0); // Filtramos los nuevos datos
        }
      },
      error: () => {
        console.log('Usando datos manuales');
        this.filterFoods(0); // Filtramos los datos manuales
      }
    });

    this.updateCartCount();
    this.refreshOrdersFlag();
    window.addEventListener('storage', () => {
      this.updateCartCount();
      this.refreshOrdersFlag();
    });
  }

  // 3. Función de filtrado
  filterFoods(standId: number) {
    this.selectedCategory = standId;
    if (standId === 0) {
      this.displayedFoods = this.foods;
    } else {
      this.displayedFoods = this.foods.filter(item => item.food_stand_id === standId);
    }
  }

  updateCartCount() {
    const items = this.cartService.getItems();
    this.cartCount = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 0), 0);
  }

  refreshOrdersFlag() {
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.hasOrders = Array.isArray(orders) && orders.length > 0;
      },
      error: () => {
        const flag = localStorage.getItem('equipo4_has_orders');
        this.hasOrders = flag === 'true';
      }
    });
  }
}