import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

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
}
