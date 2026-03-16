import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/api';

  // This broadcasts cart count to the navbar
  cartCount$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.syncCartCount();
  }

  syncCartCount() {
    const user = this.authService.getUser();

    // If no user logged in, set count to 0 and stop
    if (!user) {
      this.cartCount$.next(0);
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/cart/${user.id}`).subscribe({
      next: (items) => {
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount$.next(total);
      },
      error: () => this.cartCount$.next(0)  // silently fail, show 0
    });
  }

  // Call this after adding/removing items to refresh count
  refreshCount() {
    this.syncCartCount();
  }
}