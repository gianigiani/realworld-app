import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthForm } from '../../features/auth/model/authForm.interface';
import { AuthService } from '../../features/auth/service/auth.service';
import { ErrorService } from '../../features/errors/service/error.service';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  authService = inject(AuthService);
  authForm: FormGroup<AuthForm>;
  errorService = inject(ErrorService);
  router = inject(Router);

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
    this.authService
      .register({
        username: this.authForm.value.username!,
        email: this.authForm.value.email!,
        password: this.authForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorService.setErrorMessage(error);
        },
      });
  }
}
