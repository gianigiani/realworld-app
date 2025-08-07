import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthForm } from '../../features/auth/model/authForm.interface';
import { AuthService } from '../../features/auth/service/auth.service';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authForm: FormGroup<AuthForm>;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = signal('');
  isLoading = signal(false);

  constructor() {
    this.authForm = new FormGroup<AuthForm>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
    });
  }

  onSubmit() {
    this.isLoading.set(true);
    this.authService
      .login({
        email: this.authForm.value.email!,
        password: this.authForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.error && error.error.message) {
            this.errorMessage.set(error.error.message);
          } else {
            this.errorMessage.set('Login failed. Please try again.');
          }
          console.error('Login failed:', error);
        },
      });
  }
}
