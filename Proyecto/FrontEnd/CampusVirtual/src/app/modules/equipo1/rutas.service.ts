import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Horarios {
  dias_habiles?: string | null;
  sabado?: string | null;
  domingo?: string | null;
}

export interface Mapa {
  iframe_src?: string | null;
}

export interface Ruta {
  id: string;
  nombre: string;
  tipo: 'urbana' | 'escolar';
  frecuencia_min: number;
  horarios: Horarios;
  paradas_principales: string[];
  mapa: Mapa;
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  // Backend FastAPI
  private readonly baseUrl = 'http://127.0.0.1:8000/api/equipo1/rutas';

  constructor(private http: HttpClient) {}

  listar(tipo?: string, q?: string): Observable<Ruta[]> {
    let params = new HttpParams();
    if (tipo) params = params.set('tipo', tipo);
    if (q) params = params.set('q', q);
    return this.http.get<Ruta[]>(this.baseUrl, { params });
  }

  detalle(id: string): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.baseUrl}/${id}`);
  }
}
