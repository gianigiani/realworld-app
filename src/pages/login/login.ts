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

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authForm: FormGroup<AuthForm>;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = signal('');

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
    this.authService
      .login({
        email: this.authForm.value.email!,
        password: this.authForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
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
