import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authStore } from '../store/auth.store';

export const authGuard = () => {
  const store = inject(authStore);
  const router = inject(Router);

  return store.isAuthenticated() ? true : router.parseUrl('/login');
};
