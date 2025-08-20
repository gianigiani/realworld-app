import { Routes } from '@angular/router';
import { authGuard } from '../features/auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login').then((m) => m.Login),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../pages/settings/settings').then((m) => m.Settings),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../features/profile/profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: 'article/:slug',
    loadComponent: () =>
      import('../pages/article/article').then((m) => m.ArticleComponent),
  },
  {
    path: 'editor',
    loadComponent: () => import('../pages/editor/editor').then((m) => m.Editor),
    canActivate: [authGuard],
  },
];
