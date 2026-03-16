import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicineService } from '../../../services/medicine';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];
  isLoading     = true;

  constructor(
    private medicineService: MedicineService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.isLoading = true;
    this.medicineService.getAllOrders().subscribe({
      next: (data: any) => {
        this.orders    = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(orderId: number, status: string) {
    this.medicineService.updateOrderStatus(orderId, status).subscribe({
      next: () => this.loadOrders(),
      error: (err: any) => console.error(err)
    });
  }
}
