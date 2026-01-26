import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../../../services/medicine';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.css']
})
export class AdminOrders implements OnInit {
  orders: any[] = [];
  isLoading: boolean = false;

  constructor(
    private medicineService: MedicineService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.medicineService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensures the table renders immediately
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}