import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '../features/auth/api/auth.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/register/register').then((m) => m.Register),
    canActivate: [() => !inject(AuthService).isAuthenticated()],
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login').then((m) => m.Login),
    canActivate: [() => !inject(AuthService).isAuthenticated()],
  },
];
