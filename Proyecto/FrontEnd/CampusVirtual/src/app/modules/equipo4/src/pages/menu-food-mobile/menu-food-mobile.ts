import { Component } from '@angular/core';
// ¡¡1. AÑADE ESTA LÍNEA!!
import { ProductCard } from '../../components/product-card/product-card'; 

@Component({
  selector: 'app-menu-food-mobile',
  standalone: true,
  imports: [
    ProductCard // <-- ¡¡2. AÑADE ESTO AQUÍ!!
  ],
  templateUrl: './menu-food-mobile.html',
  styleUrls: ['./menu-food-mobile.css'] 
})

export class MenuFoodMobile {

}