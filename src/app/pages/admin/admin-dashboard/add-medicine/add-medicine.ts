import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MedicineService } from '../../../../services/medicine';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-medicine.html',
  styleUrl: './add-medicine.css'
})
export class AddMedicine {

  medicine = {
    name:        '',
    category:    '',
    price:       '',
    stock:       '',
    expiry_date: '',
    description: ''
  };

  message   = '';
  isSuccess = false;
  isLoading = false;

  constructor(
    private medicineService: MedicineService,
    private router: Router
  ) {}

  addMedicine() {
    if (!this.medicine.name || !this.medicine.price || !this.medicine.stock) {
      this.message   = 'Name, price and stock are required!';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message   = '';

    this.medicineService.addMedicine(this.medicine).subscribe({
      next: () => {
        this.message   = '✅ Medicine added successfully!';
        this.isSuccess = true;
        this.isLoading = false;
        // Reset form
        this.medicine = {
          name: '', category: '', price: '',
          stock: '', expiry_date: '', description: ''
        };
      },
      error: (err: any) => {
        this.message   = err.error?.message || 'Failed to add medicine.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}