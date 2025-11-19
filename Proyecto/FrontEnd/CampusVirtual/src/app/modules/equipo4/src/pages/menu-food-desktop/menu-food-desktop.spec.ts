import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFoodDesktop } from './menu-food-desktop';

describe('MenuFoodDesktop', () => {
  let component: MenuFoodDesktop;
  let fixture: ComponentFixture<MenuFoodDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuFoodDesktop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuFoodDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
