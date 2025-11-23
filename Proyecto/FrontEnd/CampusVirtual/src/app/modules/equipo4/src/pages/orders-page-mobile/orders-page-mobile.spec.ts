import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPageMobile } from './orders-page-mobile';

describe('OrdersPageMobile', () => {
  let component: OrdersPageMobile;
  let fixture: ComponentFixture<OrdersPageMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPageMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersPageMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
