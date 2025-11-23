import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hola-equipo1',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 👈 agrega RouterModule
  templateUrl: './hola-equipo1.html',
  styleUrl: './hola-equipo1.css'
})
export class HolaEquipo1 {
  constructor(private router: Router) {}

  navegarATourVirtual() {
    this.router.navigate(['/equipo1/tour-virtual']);
  }

  btnGaleria() {
    this.router.navigate(['/equipo1/Galeria']);   // tu ruta está con G mayúscula
  }

  btnTransporte() {
    this.router.navigate(['/equipo1/transporte']);
  }

  btnRutasUrbanas() {
    this.router.navigate(['/equipo1/rutas-urbanas']); // 👈 coincide con tu routing
  }

  btnHome() {
    this.router.navigate(['/home']);
  }
}
