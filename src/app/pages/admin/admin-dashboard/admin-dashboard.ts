import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MedicineService } from '../../../services/medicine';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  totalMedicines = 0;
  totalOrders    = 0;
  pendingOrders  = 0;
  lowStock       = 0;
  revenue        = 0;

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.medicineService.getAdminStats().subscribe({
      next: (data: any) => {
        this.totalMedicines = data.totalMedicines;
        this.totalOrders    = data.totalOrders;
        this.pendingOrders  = data.pendingOrders;
        this.lowStock       = data.lowStock;
        this.revenue        = data.revenue;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Stats error', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}