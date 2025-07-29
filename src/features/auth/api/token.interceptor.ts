import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  const updatedReq = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
  });
  return next(updatedReq);
};
