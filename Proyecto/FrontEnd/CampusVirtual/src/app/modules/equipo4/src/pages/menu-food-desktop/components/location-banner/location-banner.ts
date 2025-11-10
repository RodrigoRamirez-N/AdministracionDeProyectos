import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface LocationInfo {
  key: string;
  title: string;
  imageUrl: string;
  hours: string; // Ej: "8:10 - 21:10"
  description?: string; // breve copy del lugar
}

const PLACEHOLDER =
  'https://i.imgur.com/sbTQHpz.png';

const LOCATION_DATA: Record<string, LocationInfo> = {
  Todos: {
    key: 'Todos',
    title: 'Cafeterías',
    imageUrl: PLACEHOLDER,
    hours: '',
    description: 'Explora todas las ubicaciones',
  },
  'El Punto': {
    key: 'El Punto',
    title: 'El Punto',
    imageUrl: PLACEHOLDER,
    hours: '8:10 - 21:10',
    description: 'cafetería',
  },
  'Facultad de Ingeniería': {
    key: 'Facultad de Ingeniería',
    title: 'Facultad de Ingeniería',
    imageUrl: PLACEHOLDER,
    hours: '8:10 - 21:10',
    description: 'cafetería',
  },
  'Facultad de Música': {
    key: 'Facultad de Música',
    title: 'Facultad de Música',
    imageUrl: PLACEHOLDER,
    hours: '8:10 - 21:10',
    description: 'cafetería',
  },
};

@Component({
  selector: 'app-location-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-banner.html',
  styleUrls: ['./location-banner.css']
})
export class LocationBannerComponent {
  /** Ubicación seleccionada: debe coincidir con las claves de LOCATION_DATA */
  @Input() location: string = 'Todos';

  get info(): LocationInfo {
    return LOCATION_DATA[this.location] ?? LOCATION_DATA['Todos'];
  }
}
