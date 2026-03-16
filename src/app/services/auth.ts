import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  // ← Broadcasts login state changes to navbar instantly
  loggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  saveUser(user: any) {
    localStorage.setItem('pharma_user', JSON.stringify(user));
    this.loggedIn$.next(true);   // ← notify navbar immediately
  }

  getUser(): any {
    const user = localStorage.getItem('pharma_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  logout() {
    localStorage.removeItem('pharma_user');
    this.loggedIn$.next(false);  // ← notify navbar immediately
  }
}