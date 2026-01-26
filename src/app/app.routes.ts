// import { Routes } from '@angular/router';
// import { Home } from './pages/home/home';
// import { Medicines } from './pages/medicines/medicines';
// import { Cart } from './pages/cart/cart';
// import { authGuard } from './services/auth.guard'; // 👈 Import guard

// export const routes: Routes = [
//   // USER ROUTES
//   { path: '', component: Home },
//   { path: 'medicines', component: Medicines },
//   { path: 'cart', component: Cart },
//   { 
//     path: 'checkout', 
//     loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout),
//     canActivate: [authGuard] // 🔐 Protection active
//   },
//   { 
//     path: 'login', 
//     loadComponent: () => import('./pages/login/login').then(m => m.Login) 
//   },
//   {
//     path: 'order-success',
//     loadComponent: () => import('./pages/order-success/order-success').then(m => m.OrderSuccess)
//   },

//   // ADMIN ROUTES
//   {
//     path: 'admin-login',
//     loadComponent: () => import('./pages/admin/admin-login/admin-login').then(m => m.AdminLogin)
//   },
//   {
//     path: 'admin/dashboard',
//     loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
//   },
//   {
//     path: 'admin/add-medicine',
//     loadComponent: () => import('./pages/admin/admin-dashboard/add-medicine/add-medicine').then(m => m.AddMedicine)
//   },
//   {
//     path: 'admin/orders',
//     loadComponent: () => import('./pages/admin/admin-orders/admin-orders').then(m => m.AdminOrders)
//   },
//   {
//     path: 'admin/medicines',
//     loadComponent: () => import('./pages/admin/admin-medicines/admin-medicines').then(m => m.AdminMedicinesComponent)
//   },
  
//   // WILDCARD (Redirect to home if route not found)
//   { path: '**', redirectTo: '' }
// ];
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Medicines } from './pages/medicines/medicines';
import { Cart } from './pages/cart/cart';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  // --- USER ROUTES ---
  { path: '', component: Home },
  { path: 'medicines', component: Medicines },
  { path: 'cart', component: Cart },
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
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
  {
    path: 'admin/add-medicine',
    loadComponent: () => import('./pages/admin/admin-dashboard/add-medicine/add-medicine').then(m => m.AddMedicine)
  },
  {
    path: 'admin/orders',
    loadComponent: () => import('./pages/admin/admin-orders/admin-orders').then(m => m.AdminOrders)
  },
  {
    path: 'admin/medicines',
    loadComponent: () => import('./pages/admin/admin-medicines/admin-medicines').then(m => m.AdminMedicinesComponent)
  },
  
  // --- WILDCARD ---
  { path: '**', redirectTo: '' }
];