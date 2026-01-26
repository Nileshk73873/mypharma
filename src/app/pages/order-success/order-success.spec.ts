import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSuccess } from './order-success';
import { RouterLink } from '@angular/router';


describe('OrderSuccess', () => {
  let component: OrderSuccess;
  let fixture: ComponentFixture<OrderSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
