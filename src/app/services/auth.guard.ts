import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if user is stored in localStorage after login
  const loggedUser = localStorage.getItem('user');

  if (loggedUser) {
    return true; // User is logged in, allow them to reach Checkout
  } else {
    // User is not logged in
    alert('You must be logged in to place an order.');
    router.navigate(['/login']); 
    return false;
  }
};