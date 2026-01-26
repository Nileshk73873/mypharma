import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MedicineService } from '../../../services/medicine';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  totalMedicines: number = 0;
  totalOrders: number = 0;

  constructor(
    private medicineService: MedicineService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject to force UI updates
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  /**
   * Fetches counts for both medicines and orders
   */
  loadDashboardStats(): void {
    // 1. Get Medicine Count
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.totalMedicines = data.length;
        this.cdr.detectChanges(); // Update the "Total Medicines" card
      },
      error: (err) => console.error('Error fetching medicines:', err)
    });

    // 2. Get Orders Count
   // inside admin-dashboard.ts

this.medicineService.getOrders().subscribe({
  next: (data: any[]) => { // 👈 Change to (data: any[])
    this.totalOrders = data.length;
    this.cdr.detectChanges();
  },
  error: (err: any) => { // 👈 Change to (err: any)
    console.error('Error fetching orders:', err);
  }
});
  }

  /**
   * Clears session and redirects to login
   */
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin');
      // Ensure this path matches your routes.ts exactly
      this.router.navigate(['/admin-login']);
    }
  }
}