import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = inject(AuthService).getToken();

  if (token && authService.isTokenValid(token)) {
    const updatedReq = req.clone({
      setHeaders: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return next(updatedReq);
  }
  return next(req);
};
