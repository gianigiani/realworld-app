import {
  ApplicationConfig,
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
import { baseUrlInterceptor } from '../features/auth/interceptors/api.interceptor';
import { tokenInterceptor } from '../features/auth/interceptors/token.interceptor';
import { AuthService } from '../features/auth/service/auth.service';
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
    // provideAppInitializer(() => {
    //   const authService = inject(AuthService);
    //   return initAuth(authService)();
    // }),
  ],
};
