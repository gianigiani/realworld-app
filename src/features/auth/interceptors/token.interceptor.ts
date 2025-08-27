import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.token();

  const updatedReq = req.clone({
    setHeaders: token ? { Authorization: `Token ${token}` } : {},
  });
  return next(updatedReq);
};
