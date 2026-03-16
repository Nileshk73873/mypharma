import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineService } from '../../services/medicine';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  cartItems: any[] = [];
  isPlacing        = false;
  message          = '';
  totalAmount      = 0;

  customer = {
    fullName: '',
    mobile:   '',
    address:  '',
    city:     '',
    pincode:  ''
  };

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef    // ← ADD
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCart();
  }

  loadCart() {
    const user = this.authService.getUser();
    this.medicineService.getCart(user.id).subscribe({
      next: (data: any) => {
        this.cartItems   = data;
        this.totalAmount = this.calculateTotal();
        this.cdr.detectChanges();     // ← ADD
      },
      error: (err: any) => console.error('Error loading cart', err)
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
  }

  placeOrder() {
    const user = this.authService.getUser();

    if (this.cartItems.length === 0) {
      this.message = 'Your cart is empty!';
      return;
    }

    this.isPlacing = true;

    const items = this.cartItems.map(item => ({
      medicine_id:   item.medicine_id,
      quantity:      item.quantity,
      price_at_time: item.price
    }));

    this.medicineService.placeOrder(user.id, items, this.totalAmount).subscribe({
      next: () => {
        this.cartService.refreshCount();
        this.router.navigate(['/order-success']);
      },
      error: (err: any) => {
        console.error('Error placing order', err);
        this.message  = 'Failed to place order. Please try again.';
        this.isPlacing = false;
        this.cdr.detectChanges();
      }
    });
  }
}