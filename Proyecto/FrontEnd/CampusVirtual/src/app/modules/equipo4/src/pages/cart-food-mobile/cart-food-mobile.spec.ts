import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartFoodMobile } from './cart-food-mobile';

describe('CartFoodMobile', () => {
  let component: CartFoodMobile;
  let fixture: ComponentFixture<CartFoodMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartFoodMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFoodMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
