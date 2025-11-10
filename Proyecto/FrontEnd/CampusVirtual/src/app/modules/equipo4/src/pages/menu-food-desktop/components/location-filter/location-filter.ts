import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-filter.html',
  styleUrl: './location-filter.css',
})
export class LocationFilterComponent implements OnInit {
  // Lista de ubicaciones a mostrar (puede ser sobreescrita por fetch).
  @Input() locations: string[] = [
    'Todos',
    'El Punto',
    'Facultad de Ingeniería',
    'Facultad de Música'
  ];
  // Endpoint opcional para obtener ubicaciones dinámicamente.
  @Input() locationsUrl?: string;
  @Input() selected: string = 'Todos';
  @Output() selectedChange = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.locationsUrl) {
      this.loadLocations();
    }
  }

  async loadLocations() {
    try {
      const res = await fetch(this.locationsUrl!);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const fetched: any = Array.isArray(raw)
        ? raw
        : (raw && Array.isArray(raw.locations) ? raw.locations : null);
      if (fetched) {
        const sanitized = fetched
          .filter((x: any) => typeof x === 'string')
          .map((x: string) => x.trim())
          .filter((x: string) => x.length > 0 && x !== 'Todos');
        const withTodos = ['Todos', ...sanitized];
        this.locations = withTodos;
        // Asegura que el seleccionado siga siendo válido.
        if (!this.locations.includes(this.selected)) {
          this.selected = 'Todos';
          this.selectedChange.emit(this.selected);
        }
      }
    } catch (err) {
      // Fallback silencioso: mantiene las ubicaciones por defecto.
      console.error('No se pudieron cargar ubicaciones, usando valores por defecto.', err);
    }
  }

  pick(loc: string) {
    if (this.selected === loc) return;
    this.selected = loc;
    this.selectedChange.emit(loc);
  }
}
