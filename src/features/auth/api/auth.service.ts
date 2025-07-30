import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from '../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => !!this.currentUser());

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
      .pipe(tap(({ user }) => this.setToken(user)));
  }

  //login existing user
  login(user: { email: string; password: string }): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>('/users/login', {
        user,
      })
      .pipe(tap(({ user }) => this.setToken(user)));
  }

  //set user token
  setToken(user: User): void {
    localStorage.setItem('token', `${user.token}`);
    this.currentUserSignal.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
    localStorage.removeItem('token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }
}
