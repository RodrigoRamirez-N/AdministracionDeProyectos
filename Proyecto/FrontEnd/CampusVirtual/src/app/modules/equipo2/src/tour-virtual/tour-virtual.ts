import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-virtual',
  imports: [],
  templateUrl: './tour-virtual.html',
  styleUrl: './tour-virtual.css'
})
export class TourVirtual {
  constructor(private router: Router) {}

  volverAHome() {
    this.router.navigate(['/equipo2']);
  }
}
