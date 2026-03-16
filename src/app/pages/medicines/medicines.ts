import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineService } from '../../services/medicine';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicines.html',
  styleUrl: './medicines.css'
})
export class MedicinesComponent implements OnInit {

  medicines: any[] = [];
  message   = '';
  isLoading = true;

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← ADD THIS
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.medicineService.getMedicines().subscribe({
      next: (data: any) => {
        this.medicines = data;
        this.isLoading = false;
        this.cdr.detectChanges();    // ← ADD THIS
      },
      error: (err: any) => {
        console.error('Error loading medicines', err);
        this.isLoading = false;
        this.cdr.detectChanges();    // ← ADD THIS
      }
    });
  }

  addToCart(medicine: any) {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.medicineService.addToCart(user.id, medicine.id, 1).subscribe({
      next: () => {
        this.message = `${medicine.name} added to cart!`;
        this.cartService.refreshCount();
        this.cdr.detectChanges();    // ← ADD THIS
        setTimeout(() => {
          this.message = '';
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err: any) => console.error('Error adding to cart', err)
    });
  }
}