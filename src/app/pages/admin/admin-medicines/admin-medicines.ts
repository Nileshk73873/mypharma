import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Add ChangeDetectorRef here
import { CommonModule } from '@angular/common';
import { MedicineService } from '../../../services/medicine';

@Component({
  selector: 'app-admin-medicines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-medicines.html',
  styleUrls: ['./admin-medicines.css']
})
export class AdminMedicinesComponent implements OnInit {
  medicines: any[] = [];
  isLoading: boolean = false;

  // 👈 Inject cdr in the constructor
  constructor(
    private medicineService: MedicineService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.isLoading = true;
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        console.log('Medicines received by Admin:', data);
        this.medicines = data;
        this.isLoading = false; 
        
        // 👈 Manually tell Angular to update the HTML table
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteMedicine(id: string): void {
    if (confirm('Delete this medicine?')) {
      this.medicineService.deleteMedicine(id).subscribe({
        next: () => {
          this.loadMedicines(); // Refresh the list
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}