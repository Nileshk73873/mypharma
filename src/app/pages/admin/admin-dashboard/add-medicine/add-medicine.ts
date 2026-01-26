import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../../../../services/medicine';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
imports: [RouterLink, FormsModule, CommonModule],
templateUrl: './add-medicine.html',
  styleUrls: ['./add-medicine.css']
})
export class AddMedicine {

  medicine = {
    name: '',
    price: 0,
    stock: 'In Stock'
  };

  constructor(private medicineService: MedicineService) {}

  addMedicine() {
  this.medicineService.addMedicine(this.medicine).subscribe({
    next: () => {
      alert('Medicine added successfully');
      this.medicine = { name: '', price: 0, stock: 'In Stock' };
    },
    error: () => {
      alert('Failed to add medicine ❌');
    }
  });
}

}
