import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { baseUrlInterceptor } from '../features/auth/api/api.interceptor';
import { AuthService } from '../features/auth/api/auth.service';
import { tokenInterceptor } from '../features/auth/api/token.interceptor';
import { routes } from './app.routes';

export function initAuth(authService: AuthService) {
  return () => (authService.getToken() ? authService.getCurrentUser() : EMPTY);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, tokenInterceptor]),
      withFetch(),
    ),
    provideAppInitializer(() => {
      const initializerFn = initAuth(inject(AuthService));
      return initializerFn();
    }),
  ],
};
