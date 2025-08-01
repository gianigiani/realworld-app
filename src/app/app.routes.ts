import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authStore } from '../features/auth/store/auth.store';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/register/register').then((m) => m.Register),
    canActivate: [() => !inject(authStore).isAuthenticated()],
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login').then((m) => m.Login),
    canActivate: [() => !inject(authStore).isAuthenticated()],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../pages/settings/settings').then((m) => m.Settings),
    canActivate: [() => inject(authStore).isAuthenticated()],
  },
  {
    path: 'profile/:username',
    loadComponent: () =>
      import('../pages/profile/profile').then((m) => m.Profile),
    canActivate: [() => inject(authStore).isAuthenticated()],
  },
];
