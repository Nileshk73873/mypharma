import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  name     = '';
  email    = '';
  password = '';
  contact  = '';
  message  = '';
  isLoading = false;
  showPassword = false;   // ← ADD

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.message = 'Name, email and password are required';
      return;
    }

    this.isLoading = true;
    this.message   = '';

    this.authService.register({
      name:     this.name,
      email:    this.email,
      password: this.password,
      contact:  this.contact
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.message   = err.error?.message || 'Registration failed. Try again.';
        this.isLoading = false;
      }
    });
  }
}