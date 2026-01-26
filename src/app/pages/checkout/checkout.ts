import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  cartItems: any[] = [];
  totalAmount = 0;

  // This object stores the input values
  customer = {
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    pincode: ''
  };

  constructor(
    private cartService: CartService, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Checkout error:', err)
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  placeOrder() {
    const orderData = {
      customer: this.customer, // Includes the filled form details
      items: this.cartItems,
      total: this.totalAmount,
      createdAt: new Date()
    };

    this.cartService.placeOrder(orderData).subscribe(() => {
      // Clear the cart globally so the Navbar updates to (0)
      this.cartService.clearCart().subscribe(() => {
        this.router.navigate(['/order-success']);
      });
    });
  }
}