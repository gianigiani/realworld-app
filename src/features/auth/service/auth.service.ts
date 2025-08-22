import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
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

  errorMessage = signal('');
  private tokenExpirationTimer: number | null = null;

  //register new user
  register(user: {
    username: string;
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>('/users', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.setUser(user);
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
        this.store.setUser(user);
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
        this.store.setUser(user);
      }),
      catchError((errorRes: HttpErrorResponse) =>
        this.errorService.handleError(errorRes),
      ),
    );
  }

  getToken(): string | null {
    return this.tokenService.getValidToken();
  }

  autoLogin(): void {
    const token = this.tokenService.getValidToken();
    if (!token) {
      return;
    }

    // If we already have a user in store, do nothing
    // Otherwise fetch current user with the valid token
    if (!this.store.isAuthenticated()) {
      this.getCurrentUser().subscribe();
    }

    // Schedule automatic logout at token expiration
    const ms = this.tokenService.getRemainingTimeValidity(token);

    if (ms > 0) {
      this.autoLogout(ms);
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration,
    );
  }

  getCurrentUser() {
    this.store.setIsLoadingUser(true);
    return this.http.get<{ user: User }>('/user').pipe(
      tap(({ user }: { user: User }) => {
        this.tokenService.set(user.token);
        this.store.setUser(user);
        this.store.setIsLoadingUser(false);

        // Schedule automatic logout at token expiration
        const ms = this.tokenService.getRemainingTimeValidity(user.token);
        if (ms > 0) this.autoLogout(ms);
      }),
      catchError((errorRes: HttpErrorResponse) => {
        this.store.setIsLoadingUser(false);
        return this.errorService.handleError(errorRes);
      }),
    );
  }

  logout() {
    this.tokenService.remove();
    this.store.logout();
    this.router.navigate(['/login']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
