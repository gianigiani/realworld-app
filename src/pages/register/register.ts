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
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  authForm: FormGroup<AuthForm>;
  authService = inject(AuthService);
  router = inject(Router);
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
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
    });
  }

  onSubmit() {
    this.isLoading.set(true);
    this.authService
      .register({
        username: this.authForm.value.username!,
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
          this.authService.errorMessage.set(error.error.message);
        },
      });
  }
}
