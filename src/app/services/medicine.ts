// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root' // This allows all components to use this service
// })
// export class MedicineService {
//   private apiUrl = 'http://localhost:3000/api/medicines';

//   constructor(private http: HttpClient) {}

//   // 1. GET all medicines
//   getMedicines(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl);
//   }

//   // 2. ADD medicine
//   addMedicine(medicineData: any): Observable<any> {
//     return this.http.post(this.apiUrl, medicineData);
//   }

//   // 3. DELETE medicine
//   deleteMedicine(id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private apiUrl = 'http://localhost:3000/api/medicines';
  private ordersUrl = 'http://localhost:3000/api/orders';
  constructor(private http: HttpClient) {}

  getMedicines(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  addMedicine(medicineData: any): Observable<any> {
    return this.http.post(this.apiUrl, medicineData);
   }

  // Ensure these other functions are inside this class too
  deleteMedicine(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);

  }
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl);
  }
}