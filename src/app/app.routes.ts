import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  // --- USER ROUTES ---
  {
  path: 'order-history',
  loadComponent: () => import('./pages/order-history/order-history').then(m => m.OrderHistoryComponent),
  canActivate: [authGuard]
},
  { path: '', component: Home },
  {
    path: 'medicines',
    loadComponent: () => import('./pages/medicines/medicines').then(m => m.MedicinesComponent)
  },
 {
  path: 'cart',
  loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent)
},
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
  path: 'register',
  loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
},
  {
    path: 'order-success',
    loadComponent: () => import('./pages/order-success/order-success').then(m => m.OrderSuccess)
  },

  // --- ADMIN ROUTES ---
  {
    path: 'admin-login',
    loadComponent: () => import('./pages/admin/admin-login/admin-login').then(m => m.AdminLogin)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/add-medicine',
    loadComponent: () => import('./pages/admin/admin-dashboard/add-medicine/add-medicine').then(m => m.AddMedicine)
  },
  {
    path: 'admin/orders',
    loadComponent: () => import('./pages/admin/admin-orders/admin-orders').then(m => m.AdminOrdersComponent)
  },
  {
    path: 'admin/medicines',
    loadComponent: () => import('./pages/admin/admin-medicines/admin-medicines').then(m => m.AdminMedicinesComponent)
  },

  // --- WILDCARD ---
  { path: '**', redirectTo: '' }
];