import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
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

  signedin$ = new BehaviorSubject<boolean | null>(null);

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
        this.signedin$.next(true);
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
        this.signedin$.next(true);
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
        this.signedin$.next(true);
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
    return this.http.get<{ user: User }>('/user').pipe(
      tap(({ user }: { user: User }) => {
        this.tokenService.set(user.token);
        this.store.setUser(user);
        this.signedin$.next(true);
      }),
      catchError((errorRes: HttpErrorResponse) =>
        this.errorService.handleError(errorRes),
      ),
    );
  }

  logout() {
    this.signedin$.next(false);
    this.tokenService.remove();
    this.store.logout();
    this.router.navigate(['/login']);
  }
}
