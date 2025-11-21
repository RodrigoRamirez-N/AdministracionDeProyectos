import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { Equipo4ApiService, FoodItem } from '../../services/equipo4-api.service';

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
  selectedCategory: number = 0;
  cartCount: number = 0;

  constructor(private apiService: Equipo4ApiService) {}

  ngOnInit() {
    // Intentamos cargar de la API
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
    window.addEventListener('storage', () => this.updateCartCount());
  }

  // 3. Función de filtrado (La que te faltaba)
  filterFoods(idLocal: number) {
    this.selectedCategory = idLocal;
    if (idLocal === 0) {
      this.displayedFoods = this.foods;
    } else {
      this.displayedFoods = this.foods.filter(item => item.food_stand_id === idLocal);
    }
  }

 // ...
  updateCartCount() {
    const data = localStorage.getItem('equipo4_cart_items');
    let cart: any[] = [];

    try {
      const parsed = data ? JSON.parse(data) : [];
      // Si no es un array, usamos vacío
      cart = Array.isArray(parsed) ? parsed : [];
    } catch {
      cart = [];
    }

    // Ahora es seguro usar .reduce
    this.cartCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  }
  // ...
}