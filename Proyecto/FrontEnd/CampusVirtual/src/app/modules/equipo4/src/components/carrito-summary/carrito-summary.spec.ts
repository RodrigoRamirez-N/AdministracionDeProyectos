import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoSummary } from './carrito-summary';

describe('CarritoSummary', () => {
  let component: CarritoSummary;
  let fixture: ComponentFixture<CarritoSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
