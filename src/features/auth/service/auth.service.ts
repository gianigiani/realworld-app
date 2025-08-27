import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { computed, effect, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

  private user = computed(() => this.getCurrentUserResource.value()?.user);
  error = computed(
    () => this.getCurrentUserResource.error() as HttpErrorResponse,
  );
  errorMsg = computed(() => this.errorService.setErrorMssage(this.error()));
  isLoading = computed(() => this.getCurrentUserResource.isLoading());

  constructor() {
    effect(() => {
      const status = this.getCurrentUserResource.status();
      if (status === 'loading') {
        return;
      }

      if (status === 'error') {
        this.errorMsg();

        this.logout();
        return null;
      }

      const user = this.user();
      if (!user) {
        return;
      }

      this.tokenService.set(user.token);
      this.store.signIn(user);
      return user;
    });
  }

  // get resources
  getCurrentUserResource = httpResource<{ user: User }>(() =>
    this.tokenService.token() ? `/user/dw` : undefined,
  );

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
      catchError((errorRes: HttpErrorResponse) => {
        this.errorService.setErrorMssage(errorRes);
        return throwError(() => errorRes);
      }),
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
      catchError((errorRes: HttpErrorResponse) => {
        // this.errorService.setErrorMssage(errorRes);
        // this.errorMsg();
        this.errorService.setErrorMssage(this.error());
        return throwError(() => errorRes);
      }),
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
      catchError((errorRes: HttpErrorResponse) => {
        this.errorService.setErrorMssage(errorRes);
        return throwError(() => errorRes);
      }),
    );
  }

  getToken(): string | null {
    return this.tokenService.getValidToken();
  }

  logout() {
    this.toastService.showSuccess('See you soon!');
    this.tokenService.remove();
    this.store.logout();
    this.router.navigate(['/login']);
  }
}
