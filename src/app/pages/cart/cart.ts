import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';        // ← ADD
import { Router } from '@angular/router';
import { MedicineService } from '../../services/medicine';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],               // ← ADD RouterModule
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  message   = '';
  isLoading = true;

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    const user     = this.authService.getUser();
    this.isLoading = true;
    this.medicineService.getCart(user.id).subscribe({
      next: (data: any) => {
        this.cartItems = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading cart', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
  }

  removeItem(medicineId: number) {
    const user = this.authService.getUser();
    this.medicineService.removeFromCart(user.id, medicineId).subscribe({
      next: () => {
        this.cartService.refreshCount();
        this.loadCart();
      },
      error: (err: any) => console.error('Error removing item', err)
    });
  }

  clearCart() {
    const user = this.authService.getUser();
    this.medicineService.clearCart(user.id).subscribe({
      next: () => {
        this.cartItems = [];
        this.message   = 'Cart cleared!';
        this.cartService.refreshCount();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.message = '';
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err: any) => console.error('Error clearing cart', err)
    });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}