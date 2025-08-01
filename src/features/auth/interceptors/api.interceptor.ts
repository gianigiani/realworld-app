import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'https://node-express-conduit.appspot.com/api';
  const updatedReq = req.clone({
    url: req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`,
  });
  return next(updatedReq);
};
