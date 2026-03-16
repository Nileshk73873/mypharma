import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ─── Medicines ──────────────────────────
  getMedicines() {
    return this.http.get(`${this.apiUrl}/medicines`);
  }

  addMedicine(data: any) {
    return this.http.post(`${this.apiUrl}/medicines`, data);
  }

  updateMedicine(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/medicines/${id}`, data);
  }

  deleteMedicine(id: number) {
    return this.http.delete(`${this.apiUrl}/medicines/${id}`);
  }

  // ─── Cart ───────────────────────────────
  getCart(userId: number) {
    return this.http.get(`${this.apiUrl}/cart/${userId}`);
  }

  addToCart(userId: number, medicineId: number, quantity: number = 1) {
    return this.http.post(`${this.apiUrl}/cart`, {
      user_id: userId,
      medicine_id: medicineId,
      quantity
    });
  }

  removeFromCart(userId: number, medicineId: number) {
    return this.http.delete(`${this.apiUrl}/cart/${userId}/${medicineId}`);
  }

 clearCart(userId: number) {
  return this.http.delete(`${this.apiUrl}/cart-clear/${userId}`);
}
  // ─── Orders ─────────────────────────────
  placeOrder(userId: number, items: any[], totalAmount: number) {
    return this.http.post(`${this.apiUrl}/orders`, {
      user_id: userId,
      items,
      total_amount: totalAmount
    });
  }

  getUserOrders(userId: number) {
    return this.http.get(`${this.apiUrl}/orders/user/${userId}`);
  }

  getAllOrders() {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.put(`${this.apiUrl}/orders/${orderId}`, { status });
  }

  // ─── Admin Stats ────────────────────────
  getAdminStats() {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }

}