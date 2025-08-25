import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
import { ToastService } from '../../../shared/toast/toast.service';
import { ErrorService } from '../../errors/service/error.service';
import { User } from '../model/user.interface';
import { authStore } from '../store/auth.store';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(authStore);
  private tokenService = inject(TokenService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);

  //register new user
  register(user: {
    username: string;
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>('/users', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.signIn(user);
        this.toastService.showSuccess("You're in!");
      }),
      catchError((errorRes: HttpErrorResponse) =>
        this.errorService.handleError(errorRes),
      ),
    );
  }

  //login existing user
  login(user: { email: string; password: string }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>('/users/login', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.signIn(user);
        this.toastService.showSuccess("You're in!");
      }),
      catchError((errorRes: HttpErrorResponse) =>
        this.errorService.handleError(errorRes),
      ),
    );
  }

  //update user settings
  update(user: {
    image: string;
    bio: string;
    username: string;
    email: string;
  }): Observable<{ user: User }> {
    return this.http.put<{ user: User }>('/user', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.signIn(user);
        this.toastService.showSuccess('Changes saved!');
      }),
      catchError((errorRes: HttpErrorResponse) =>
        this.errorService.handleError(errorRes),
      ),
    );
  }

  getToken(): string | null {
    return this.tokenService.getValidToken();
  }

  getCurrentUser() {
    const user = this.getCurrentUserResource.value()?.user;

    if (!user) {
      return null;
    }

    const error = this.getCurrentUserResource.error();
    if (error) {
      // FIXME: handle error
      // this.errorService.handleError(error);

      this.errorService.handleError(error as HttpErrorResponse);

      this.logout();
      return null;
    }

    this.tokenService.set(user.token);
    this.store.signIn(user);
    return user;
  }

  getCurrentUserResource = httpResource<{ user: User }>(() => {
    const token = this.getToken();
    if (!token) {
      return undefined;
    }
    return `/user`;
  });

  constructor() {
    effect(() => {
      const status = this.getCurrentUserResource.status();

      if (status === 'loading') {
        return;
      }

      if (status === 'error') {
        const error = this.getCurrentUserResource.error();
        this.errorService.handleError(error as HttpErrorResponse);
        // TODO: this.errorService.handleError(this.getCurrentUserResource.error())

        this.logout();
      }

      const user = this.getCurrentUserResource.value()?.user;

      if (!user) {
        return;
      }

      this.tokenService.set(user.token);
      this.store.signIn(user);
    });
  }

  logout() {
    this.toastService.showSuccess('See you soon!');
    this.tokenService.remove();
    this.store.logout();
    this.router.navigate(['/login']);
  }
}
