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
  
  // ✅ AQUÍ VA LA COMIDA (Hamburguesas), NO LOS PEDIDOS
  foods: FoodItem[] = [
    {
      id: 1,
      food_stand_id: 1,
      name: 'Hamburguesa Clásica',
      description: 'Cafetería El Punto',
      price: '100',
      rating: 4,
      image_url: 'assets/images/Recetas-de-Hamburguesa.jpg'
    },
    {
      id: 2,
      food_stand_id: 1,
      name: 'Hamburguesa Doble',
      description: 'Facultad de Sistemas',
      price: '120',
      rating: 5,
      image_url: 'assets/images/Recetas-de-Hamburguesa.jpg'
    },
    {
      id: 3,
      food_stand_id: 1,
      name: 'Papas a la Francesa',
      description: 'El Punto',
      price: '60',
      rating: 4,
      image_url: 'assets/images/Recetas-de-Hamburguesa.jpg'
    }
  ];

  cartCount: number = 0;

  constructor(private apiService: Equipo4ApiService) {}

  ngOnInit() {
    // Intentar cargar comida real
    this.apiService.getFoods().subscribe({
      next: (data) => {
        if (data && data.length > 0) this.foods = data;
      },
      error: () => console.log('Usando comida de prueba')
    });

    this.updateCartCount();
    window.addEventListener('storage', () => this.updateCartCount());
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('equipo4_cart_items') || '[]');
    this.cartCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  }
}