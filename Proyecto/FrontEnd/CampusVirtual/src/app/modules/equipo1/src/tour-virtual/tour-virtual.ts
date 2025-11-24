import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-virtual',
  imports: [CommonModule],
  templateUrl: './tour-virtual.html',
  styleUrl: './tour-virtual.css'
})
export class TourVirtual {
  currentSlide = 0;
  slides = [0, 1, 2, 3]; // Array para los indicadores

  constructor(private router: Router) {}

  volverAHome() {
    this.router.navigate(['/equipo1']);
  }

  nextSlide() {
    if (this.currentSlide < 3) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
