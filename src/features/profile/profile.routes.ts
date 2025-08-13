import { Routes } from '@angular/router';
import { ProfileComponent } from '../../pages/profile/profile';

export const profileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':username',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../../pages/user-articles/user-articles').then(
                (m) => m.UserArticles,
              ),
          },
          {
            path: 'favorites',
            loadComponent: () =>
              import('../../shared/favorites/favorites').then(
                (m) => m.Favorites,
              ),
          },
        ],
      },
    ],
  },
];

export default profileRoutes;
