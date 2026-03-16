import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MedicineService } from '../../services/medicine';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistoryComponent implements OnInit {

  orders: any[]        = [];
  groupedOrders: any[] = [];
  isLoading            = true;

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.medicineService.getUserOrders(user.id).subscribe({
      next: (data: any) => {
        this.groupedOrders = this.groupByOrder(data);
        this.isLoading     = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching orders', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Group flat rows into orders with items array
  groupByOrder(data: any[]) {
    const map = new Map();
    data.forEach(row => {
      if (!map.has(row.order_id)) {
        map.set(row.order_id, {
          order_id:     row.order_id,
          total_amount: row.total_amount,
          status:       row.status,
          created_at:   row.created_at,
          items:        []
        });
      }
      map.get(row.order_id).items.push({
        medicine:      row.medicine,
        quantity:      row.quantity,
        price_at_time: row.price_at_time
      });
    });
    return Array.from(map.values());
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Delivered':  return 'status-delivered';
      case 'Processing': return 'status-processing';
      default:           return 'status-pending';
    }
  }
}