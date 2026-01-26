import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef // Forces UI refresh for async data
  ) {}

  ngOnInit() {
    // 🔔 Listen for cart updates from the service
    // This replaces your manual 'window.addEventListener'
    this.cartService.cartCount$.subscribe({
      next: (count) => {
        this.cartCount = count;
        this.cdr.detectChanges(); // 🚀 Ensures "Cart (3)" updates on screen immediately
      },
      error: (err) => console.error('Navbar subscription error:', err)
    });
  }
}