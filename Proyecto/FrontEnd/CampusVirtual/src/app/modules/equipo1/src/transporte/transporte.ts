import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transporte',
  imports: [],
  templateUrl: './transporte.html',
  styleUrl: './transporte.css'
})
export class Transporte {
  constructor(private router: Router) {}

  regresar() {
    this.router.navigate(['/equipo1']);
  }
}
