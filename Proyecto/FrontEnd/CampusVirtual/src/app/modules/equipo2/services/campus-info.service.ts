import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty, SportField, LibraryData, ImportantNumber } from '../models/campus.models';

@Injectable({
  providedIn: 'root'
})
export class CampusInfoService {
  private apiUrl = 'http://127.0.0.1:8000/equipo2';

  constructor(private http: HttpClient) { }

  getDirectory(search: string = ''): Observable<Faculty[]> {
    const url = search ? `${this.apiUrl}/directorio?search=${search}` : `${this.apiUrl}/directorio`;
    return this.http.get<Faculty[]>(url);
  }

  getSportFields(): Observable<SportField[]> {
    return this.http.get<SportField[]>(`${this.apiUrl}/campos-deportivos`);
  }

  getLibraryInfo(): Observable<LibraryData> {
    return this.http.get<LibraryData>(`${this.apiUrl}/biblioteca`);
  }

  getImportantNumbers(): Observable<ImportantNumber[]> {
    return this.http.get<ImportantNumber[]>(`${this.apiUrl}/numeros-importantes`);
  }
}