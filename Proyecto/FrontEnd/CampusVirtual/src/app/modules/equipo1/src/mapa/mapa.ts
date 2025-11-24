import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements AfterViewInit, OnDestroy {
  private map?: L.Map;

  constructor(private router: Router) {}

  navegarHome(): void {
    this.router.navigate(['/equipo1']);
  }

  ngAfterViewInit(): void {
    
    
    const latCampus = 25.44214; // es la cordenada central del marcado, la puse en sistemas
    const lngCampus = -100.86044;
    this.map = L.map('mapa-container').setView([latCampus, lngCampus], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // --- crea algo llamado demecom para los emojis ---
    
    const createEmojiIcon = (emoji: string, size = 34) => {
      const html = `<div class="emoji-pin" style="font-size:${size}px;line-height:1">${emoji}</div>`;
      return L.divIcon({
        html,
        className: 'emoji-div-icon', // par elcc mapp para que funcionen los emojis
        iconSize: [size, size],
        iconAnchor: [Math.round(size / 2), size],
        popupAnchor: [0, -size - 6]
      });
    };

    // -- aqui son las cordenadas---
    
    // cordenadas
    const coords = {
      // facultades
      sistemas: { lat: 25.44184, lng: -100.86060, emoji: '🖥️', name: 'Facultad de Sistemas' },
      arquitectura: { lat: 25.44090, lng: -100.86025, emoji: '📐', name: 'Facultad de Arquitectura' },
      ingenieria: { lat: 25.44000, lng: -100.86010, emoji: '⚙️', name: 'Facultad de Ingeniería' },
      artesPlasticas: { lat: 25.44250, lng: -100.85880, emoji: '🎨', name: 'Facultad de Artes Plásticas' },
      musica: { lat: 25.44150, lng: -100.85880, emoji: '🎵', name: 'Escuela Superior de Música' },

      // servicios he instalaciones
      infoteca: { lat: 25.44090, lng: -100.85960, emoji: '📚', name: 'Infoteca Central' },
      cafeteria: { lat: 25.44155, lng: -100.85960, emoji: '☕', name: 'Cafetería' },
      cultural: { lat: 25.44280, lng: -100.85960, emoji: '🎭', name: 'Centro Cultural' },
      futbol: { lat: 25.44144, lng: -100.86300, emoji: '🏈', name: 'Cancha de Fútbol Americano' }
    };

    // --- aquivan los 9 marcadores ---

    // son los puntos de interés para iterar
    const puntosInteres = Object.values(coords);

    puntosInteres.forEach(punto => {
      L.marker([punto.lat, punto.lng], { icon: createEmojiIcon(punto.emoji, 34) })
        .addTo(this.map!)
        .bindPopup(`<strong>${punto.emoji} ${punto.name}</strong>`);
    });
    
    // es para el primer marcador (Facultad de Sistemas) al cargar el mapa jkj
    L.marker([coords.sistemas.lat, coords.sistemas.lng])
      .addTo(this.map!)
      .bindPopup(`<strong>${coords.sistemas.emoji} ${coords.sistemas.name}</strong>`)
      .openPopup();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}




