import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicineService } from '../../../services/medicine';

@Component({
  selector: 'app-admin-medicines',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-medicines.html',
  styleUrl: './admin-medicines.css'
})
export class AdminMedicinesComponent implements OnInit {

  medicines: any[] = [];
  isLoading        = true;
  editMode         = false;
  selectedMed: any = {};

  constructor(
    private medicineService: MedicineService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadMedicines(); }

  loadMedicines() {
    this.isLoading = true;
    this.medicineService.getMedicines().subscribe({
      next: (data: any) => {
        this.medicines = data;
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

  deleteMedicine(id: number) {
    if (confirm('Delete this medicine?')) {
      this.medicineService.deleteMedicine(id).subscribe({
        next: () => this.loadMedicines(),
        error: (err: any) => console.error(err)
      });
    }
  }

  openEdit(med: any) {
    this.selectedMed = { ...med };
    this.editMode    = true;
  }

  closeEdit() {
    this.editMode    = false;
    this.selectedMed = {};
  }

  saveEdit() {
    this.medicineService.updateMedicine(this.selectedMed.id, this.selectedMed).subscribe({
      next: () => {
        this.loadMedicines();
        this.closeEdit();
      },
      error: (err: any) => console.error(err)
    });
  }
}