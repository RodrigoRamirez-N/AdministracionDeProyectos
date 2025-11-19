import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RutasService, Ruta } from '../../rutas.service';

@Component({
  selector: 'app-hola-equipo1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hola-equipo1.html',
  styleUrl: './hola-equipo1.css'
})
export class HolaEquipo1 implements OnInit {

  rutas: Ruta[] = [];
  cargando = false;
  error: string | null = null;

  filtroTipo = '';
  filtroTexto = '';

  rutaSeleccionada: Ruta | null = null;

  constructor(private rutasService: RutasService) {}

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.cargando = true;
    this.error = null;
    this.rutaSeleccionada = null;

    this.rutasService.listar(this.filtroTipo, this.filtroTexto)
      .subscribe({
        next: (data) => {
          this.rutas = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudieron cargar las rutas';
          this.cargando = false;
        }
      });
  }

  verDetalle(ruta: Ruta): void {
    this.rutaSeleccionada = ruta;
  }

  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroTexto = '';
    this.cargarRutas();
  }
}
