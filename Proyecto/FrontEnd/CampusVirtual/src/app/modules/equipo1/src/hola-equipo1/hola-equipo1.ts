import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hola-equipo1',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './hola-equipo1.html',
  styleUrl: './hola-equipo1.css'
})
export class HolaEquipo1 {
  constructor(private router: Router) {}

  navegarATourVirtual() {
    this.router.navigate(['/equipo1/tour-virtual']);
  }

  btnGaleria() {
    this.router.navigate(['/equipo1/Galeria']);   
  }

  btnTransporte() {
    this.router.navigate(['/equipo1/transporte']);
  }

  btnRutasUrbanas() {
    this.router.navigate(['/equipo1/rutas-urbanas']); 
  }

  btnHome() {
    this.router.navigate(['/home']);
  }
}
