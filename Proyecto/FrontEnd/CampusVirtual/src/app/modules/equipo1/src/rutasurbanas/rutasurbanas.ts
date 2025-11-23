import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Horarios {
  dias_habiles?: string | null;
  sabado?: string | null;
  domingo?: string | null;
}

interface Mapa {
  imagen?: string | null;   // 👈 ahora usamos imagen, no iframe
}

interface Ruta {
  id: string;
  nombre: string;
  tipo: 'urbana' | 'escolar';
  frecuencia_min: number;
  horarios: Horarios;
  paradas_principales: string[];
  mapa: Mapa;
}

@Component({
  selector: 'app-rutasurbanas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rutasurbanas.html',
  styleUrl: './rutasurbanas.css',
})
export class Rutasurbanas implements OnInit {
  // 🔹 Datos fijos
  private rutasBase: Ruta[] = [
    {
      id: 'arteaga',
      nombre: 'Ruta Arteaga',
      tipo: 'urbana',
      frecuencia_min: 33, // ✅ cada 33 min
      horarios: {
        dias_habiles: '06:00-22:00',
        sabado: '07:00-21:00',
        domingo: '07:00-20:00',
      },
      paradas_principales: [
        'Centro de Arteaga',
        'Blvd. Fundadores',
        'Entronque UAdeC',
        'Facultad de Sistemas',
      ],
      mapa: {
        // 👇 ruta a la imagen dentro de src/assets
        imagen: 'assets/rutas/ARTEAGA.png',
      },
    },
    {
      id: 'lobus',
      nombre: 'Lobus UAdeC',
      tipo: 'escolar',
      frecuencia_min: 25, // ✅ cada 25 min
      horarios: {
        dias_habiles: '6:30-7:30, 12:30-2:30, 12:50-1:10, 3:30-4:10, 8:30-9:30',
        sabado: null,
        domingo: null,
      },
      paradas_principales: [
        'Parque UAdeC',
        'Rectoría',
        'Facultad de Sistemas',
        'Facultad de Ingeniería',
      ],
      mapa: {
        imagen: 'assets/rutas/LOBUS.jpg',
      },
    },
  ];

  rutas: Ruta[] = [];
  cargando = false;
  error: string | null = null;

  filtroTipo = '';
  filtroTexto = '';

  rutaSeleccionada: Ruta | null = null;

  constructor() {}

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.cargando = true;
    this.error = null;
    this.rutaSeleccionada = null;

    const texto = this.filtroTexto.toLowerCase().trim();
    const tipo = this.filtroTipo;

    this.rutas = this.rutasBase.filter((r) => {
      const coincideTipo = tipo ? r.tipo === tipo : true;

      const coincideTexto = texto
        ? r.nombre.toLowerCase().includes(texto) ||
          r.paradas_principales.some((p) => p.toLowerCase().includes(texto))
        : true;

      return coincideTipo && coincideTexto;
    });

    this.cargando = false;
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
