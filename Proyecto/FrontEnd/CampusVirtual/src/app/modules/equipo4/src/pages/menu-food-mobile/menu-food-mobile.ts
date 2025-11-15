import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card'; 

@Component({
  selector: 'app-menu-food-mobile',
  standalone: true,
  imports: [
    ProductCard, 
    RouterModule
  ],
  templateUrl: './menu-food-mobile.html',
  styleUrls: ['./menu-food-mobile.css'] 
})

export class MenuFoodMobile {

}