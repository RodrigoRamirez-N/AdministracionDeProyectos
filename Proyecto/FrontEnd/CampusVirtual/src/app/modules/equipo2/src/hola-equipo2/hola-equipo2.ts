import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hola-equipo2',
  imports: [],
  templateUrl: './hola-equipo2.html',
  styleUrl: './hola-equipo2.css'
})
export class HolaEquipo2 {
  constructor(private router: Router) {}

  navegarATourVirtual() {
    this.router.navigate(['/equipo2/tour-virtual']);
  }
}
