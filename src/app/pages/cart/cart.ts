import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 1. Import this
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {

  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef // 👈 2. Inject it here
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges(); // 👈 3. Force UI refresh
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => {
      this.cartItems = [];
      this.cdr.detectChanges(); // 👈 4. Force refresh after clearing
      alert('Cart cleared successfully');
    });
  }
  // In your cart.component.ts
getTotal() {
  return this.cartItems.reduce((acc, item) => acc + item.price, 0);
}
}