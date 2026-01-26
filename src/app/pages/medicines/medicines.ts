import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../../services/medicine';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicines.html',
  styleUrls: ['./medicines.css']
})
export class Medicines implements OnInit {
  medicines: any[] = [];

  constructor(
    private medicineService: MedicineService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef // Required for Angular 17 async updates
  ) {}

  ngOnInit(): void {
    this.medicineService.getMedicines().subscribe((data) => {
      this.medicines = data;
      this.cdr.detectChanges();
    });
  }

  addToCart(med: any): void {
    this.cartService.addToCart(med).subscribe({
      next: () => {
        // The Service's 'tap' handles the count update
        alert(`${med.name} added to cart!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        alert('Could not add item to cart. Is the backend running?');
      }
    });
  }
  
}