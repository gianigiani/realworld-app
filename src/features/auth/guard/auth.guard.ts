import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = ():
  | boolean
  | UrlTree
  | Promise<boolean | UrlTree>
  | Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // return authService.signedin$.pipe(
  //   skipWhile((value) => value === null),
  //   take(1),
  //   map((val) => {
  //     const isAuth = val;
  //     if (isAuth) {
  //       return true;
  //     }
  //     return router.createUrlTree(['/login']);
  //   }),
  // );

  return authService.signedin$.pipe(
    filter((value) => value !== null),
    take(1),
    map((val) => {
      const isAuth = val;
      if (isAuth) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
  );
};
