import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, shareReplay, tap } from 'rxjs';
import { ErrorService } from '../../errors/service/error.service';
import { UpdateUser } from '../model/settingsForm.interface';
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
    return this.http
      .post<{ user: User }>('/users', {
        user,
      })
      .pipe(
        tap(({ user }) => this.setToken(user)),
        catchError(this.errorService.handleError.bind(this)),
      );
  }

  //login existing user
  login(user: { email: string; password: string }): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>('/users/login', {
        user,
      })
      .pipe(
        tap(({ user }) => this.setToken(user)),
        catchError(this.errorService.handleError.bind(this)),
      );
  }

  //update user settings
  update(user: {
    image: string;
    bio: string;
    username: string;
    email: string;
    token: string;
  }): Observable<{ user: User }> {
    return this.http
      .put<{ user: UpdateUser }>('/user', {
        user,
      })
      .pipe(tap(({ user }) => this.setToken(user)));
  }

  //set user token
  setToken(user: User): void {
    this.tokenService.set(`${user.token}`);
    this.store.setUser(user);
  }

  getToken(): string | null {
    const _token = this.tokenService.get();
    if (_token && this.isTokenExpired(_token)) {
      return null;
    }
    return _token;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp;

      return typeof expiration === 'number' && Date.now() > expiration * 1000;
    } catch {
      return true;
    }
  }

  getCurrentUser() {
    return this.http.get<{ user: User }>('/user').pipe(
      tap({
        next: ({ user }) => this.setToken(user),
      }),

      shareReplay(1),
    );
  }

  logout() {
    this.tokenService.remove();
    this.store.logout();
    this.router.navigate(['/']);
  }
}
