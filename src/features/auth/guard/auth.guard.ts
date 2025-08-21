import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { authStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const store = inject(authStore);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (store.isAuthenticated()) {
    return true;
  }

  const token = authService.getToken();
  if (token && store.isLoadingUser()) {
    return true;
  }

  return router.parseUrl('/login');
};
