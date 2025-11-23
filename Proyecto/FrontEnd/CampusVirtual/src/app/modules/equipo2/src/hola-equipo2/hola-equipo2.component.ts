import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { CampusInfoService } from '../../services/campus-info.service';
import { Faculty, SportField, LibraryData, ImportantNumber } from '../../models/campus.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hola-equipo2',
  standalone: false,
  templateUrl: './hola-equipo2.component.html',
  styleUrls: ['./hola-equipo2.component.css']
})
export class HolaEquipo2Component implements OnInit {

  directory$!: Observable<Faculty[]>;
  sportFields$!: Observable<SportField[]>;
  libraryData$!: Observable<LibraryData>;
  importantNumbers$!: Observable<ImportantNumber[]>;
  searchControl = new FormControl('');

  public expandedFacultyId: number | null = null;


  public activeView: 'directorio' | 'campos' | 'numeros' | 'biblioteca' = 'directorio';


  constructor(
    private campusInfoService: CampusInfoService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.sportFields$ = this.campusInfoService.getSportFields();
    this.libraryData$ = this.campusInfoService.getLibraryInfo();
    this.importantNumbers$ = this.campusInfoService.getImportantNumbers();

    this.directory$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(searchValue => this.campusInfoService.getDirectory(searchValue ?? ''))
    );
  }

  toggleFaculty(facultyId: number): void {
    if (this.expandedFacultyId === facultyId) {
      this.expandedFacultyId = null;
    } else {
      this.expandedFacultyId = facultyId;
    }
  }

  setView(view: 'directorio' | 'campos' | 'numeros' | 'biblioteca'): void {
    this.activeView = view;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}