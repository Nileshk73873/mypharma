import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {

  username = '';
  password = '';
  error = ''; // ✅ ADD THIS LINE

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'admin123') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error = 'Invalid username or password'; // ✅ USED HERE
    }
  }
}
