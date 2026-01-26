import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with MyPharma. Your medicines will be delivered soon.</p>
        <button routerLink="/medicines" class="btn-home">Continue Shopping</button>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70vh;
      text-align: center;
    }
    .success-card {
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      background: white;
    }
    .icon { font-size: 4rem; margin-bottom: 20px; }
    h1 { color: #2e7d32; margin-bottom: 10px; }
    .btn-home {
      background: #2e7d32;
      color: white;
      border: none;
      padding: 10px 25px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
    }
  `]
})
export class OrderSuccess {}