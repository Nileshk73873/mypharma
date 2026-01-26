import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // 👈 1. Import HttpClient

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule], // 👈 2. Add HttpClientModule
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // 3. Keep one consistent name (loginData)
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient // 👈 4. Inject HttpClient here
  ) {}

  onLogin() {
  // Use /api/users to match the new backend route
  this.http.get<any[]>("http://localhost:3000/api/users").subscribe({
    next: (res) => {
      const user = res.find((a: any) => {
        return a.email === this.loginData.email && a.password === this.loginData.password;
      });

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        alert("Login Successful!");
        this.router.navigate(['/cart']); 
      } else {
        alert("Invalid email or password");
      }
    },
    error: (err) => {
      console.error("Login failed", err);
      alert("Server error. Check if backend is running and /api/users exists.");
    }
  });
}
}