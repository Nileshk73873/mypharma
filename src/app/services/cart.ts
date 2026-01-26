import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private ordersUrl = 'http://localhost:3000/api/orders';

  // 1. Central stream for the cart count
  private cartCountSubject = new BehaviorSubject<number>(0);
  // 2. The observable that the Navbar (App.ts) listens to
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCount(); // Sync count as soon as the app starts
  }

  // Syncs the BehaviorSubject with the actual database length
  refreshCount(): void {
    this.getCartItems().subscribe({
      next: (items) => this.cartCountSubject.next(items.length),
      error: (err) => console.error('Error syncing cart count:', err)
    });
  }

  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToCart(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item).pipe(
      tap(() => this.refreshCount()) // 🚀 This triggers the Navbar update automatically
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.cartCountSubject.next(0)) // 🚀 Immediately resets Navbar count
    );
  }

  placeOrder(order: any): Observable<any> {
    return this.http.post(this.ordersUrl, order);
  }
}