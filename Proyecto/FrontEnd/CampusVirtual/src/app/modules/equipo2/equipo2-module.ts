import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { Equipo2RoutingModule } from './equipo2-routing-module';
import { HolaEquipo2Component } from './src/hola-equipo2/hola-equipo2.component';

@NgModule({
  declarations: [
    HolaEquipo2Component
  ],
  imports: [
    CommonModule,
    Equipo2RoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class Equipo2Module { }