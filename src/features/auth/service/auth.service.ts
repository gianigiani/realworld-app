import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
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
      catchError(this.errorService.handleError.bind(this)),
    );
  }

  //login existing user
  login(user: { email: string; password: string }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>('/users/login', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.setUser(user);
      }),
      catchError(this.errorService.handleError.bind(this)),
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
      catchError(this.errorService.handleError.bind(this)),
    );
  }

  getToken(): string | null {
    return this.tokenService.getValidToken();
  }

  getCurrentUser(): Observable<{ user: User }> {
    this.store.setIsLoadingUser(true);
    return this.http.get<{ user: User }>('/user').pipe(
      tap({
        next: ({ user }) => {
          this.tokenService.set(user.token);
          this.store.setUser(user);
        },
        error: (err) => {
          // Clear invalid token on 401 to avoid repeated failures at startup
          if (err?.status === 401) {
            this.tokenService.remove();
          }
          this.store.setIsLoadingUser(false);
        },
        complete: () => this.store.setIsLoadingUser(false),
      }),
      // keep this after the tap so error handler above still runs
      catchError((err) => throwError(() => err)),
    );
  }

  logout() {
    this.tokenService.remove();
    this.store.logout();
    this.router.navigate(['/']);
  }
}
