import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { Product } from '../../components/product-card/product.model'; 

@Component({
  selector: 'app-menu-food-mobile',
  standalone: true,
  imports: [
    CommonModule, 
    ProductCard, 
    RouterModule
  ],
  templateUrl: './menu-food-mobile.html',
  styleUrls: ['./menu-food-mobile.css'] 
})
export class MenuFoodMobile {

  //  JSON DE EJEMPLO:
  products: Product[] = [
    {
      id: 1,
      name: 'Hamburguesa Clásica',
      place: 'Cafetería Central',
      price: 100,
      image: 'assets/images/Recetas-de-Hamburguesa.jpg',
      likes: 43
    },
    {
      id: 2,
      name: 'Hamburguesa Doble',
      place: 'Facultad de Sistemas',
      price: 120,
      image: 'assets/images/Recetas-de-Hamburguesa.jpg',
      likes: 12
    },
    {
      id: 3,
      name: 'Papas a la Francesa',
      place: 'El Punto',
      price: 60,
      image: 'assets/images/Recetas-de-Hamburguesa.jpg', 
      likes: 85
    },
    {
      id: 4,
      name: 'Refresco Grande',
      place: 'El Punto',
      price: 25,
      image: 'assets/images/Recetas-de-Hamburguesa.jpg', 
      likes: 150
    }
  ];
}