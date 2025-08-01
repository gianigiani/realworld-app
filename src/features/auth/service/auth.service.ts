import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';
import { UpdateUser } from '../model/settingsForm.interface';
import { User } from '../model/user.interface';
import { authStore } from '../store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(authStore);

  // private currentUserSignal = signal<User | null>(null);
  // public currentUser = this.currentUserSignal.asReadonly();
  // public isAuthenticated = computed(() => !!this.currentUser());

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
    localStorage.setItem('token', `${user.token}`);
    // this.currentUserSignal.set(user);
    this.store.setUser(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp;
      return typeof expiration === 'number' && Date.now() < expiration * 1000;
    } catch (error) {
      console.error('Invalid token format:', error);
      return false;
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
    localStorage.removeItem('token');
    this.store.logout();
    this.router.navigate(['/']);
  }
}
