import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFoodMobile } from './menu-food-mobile';

describe('MenuFoodMobile', () => {
  let component: MenuFoodMobile;
  let fixture: ComponentFixture<MenuFoodMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuFoodMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuFoodMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
