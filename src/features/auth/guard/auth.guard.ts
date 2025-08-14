import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const store = inject(authStore);
  const router = inject(Router);

  return store.isAuthenticated() ? true : router.parseUrl('/login');
};
