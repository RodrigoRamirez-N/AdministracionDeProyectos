import { Component } from '@angular/core';
import { AppHeaderComponent } from './components/app-header/app-header';
import { ProductGridComponent } from './components/product-grid/product-grid';
import { LocationBannerComponent } from './components/location-banner/location-banner';
import { LocationFilterComponent } from './components/location-filter/location-filter';

@Component({
  selector: 'app-menu-food-desktop',
  standalone: true,
  imports: [
    AppHeaderComponent,
    ProductGridComponent,
    LocationBannerComponent,
    LocationFilterComponent
  ],
  templateUrl: './menu-food-desktop.html',
  styleUrl: './menu-food-desktop.css'
})
export class MenuFoodDesktop {
  selectedLocation = 'Todos';
}
