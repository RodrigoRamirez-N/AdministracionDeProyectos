import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFoodDesktop } from './cart-food-desktop';

describe('CartFoodDesktop', () => {
  let component: CartFoodDesktop;
  let fixture: ComponentFixture<CartFoodDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartFoodDesktop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFoodDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
