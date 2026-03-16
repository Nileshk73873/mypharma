import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {

  email     = '';
  password  = '';
  message   = '';
  isLoading = false;
  showPassword = false;   // ← ADD

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.message = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.message   = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.user.role !== 'admin') {
          this.message   = 'Access denied. Admins only.';
          this.isLoading = false;
          return;
        }
        this.authService.saveUser(res.user);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: any) => {
        this.message   = err.error?.message || 'Login failed.';
        this.isLoading = false;
      }
    });
  }
}