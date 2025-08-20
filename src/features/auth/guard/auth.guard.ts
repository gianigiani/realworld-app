import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
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
  if (token) {
    // Wait for current user to load, then allow navigation. If it fails, redirect to "/login"
    return authService.getCurrentUser().pipe(
      map(() => {
        return true;
      }),
      catchError(() => of(router.parseUrl('/login'))),
    );
  }

  return router.parseUrl('/login');
};
