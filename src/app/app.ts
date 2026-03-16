import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  cartCount  = 0;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // ← Listen to login/logout events
    this.authService.loggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      this.cdr.detectChanges();
    });

    // ← Listen to cart count changes
    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount  = count;
      this.isLoggedIn = this.authService.isLoggedIn();
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
    this.cartService.refreshCount();
    this.router.navigate(['/login']);
  }
}