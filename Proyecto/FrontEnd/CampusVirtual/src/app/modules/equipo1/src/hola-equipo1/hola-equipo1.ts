import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hola-equipo1',
  imports: [],
  templateUrl: './hola-equipo1.html',
  styleUrl: './hola-equipo1.css'
})
export class HolaEquipo1 {
  constructor(private router: Router) {}

  navegarATourVirtual() {
    this.router.navigate(['/equipo1/tour-virtual']);
  }
  btnGaleria(){
    this.router.navigate(['/equipo1/Galeria']);
  }
}
