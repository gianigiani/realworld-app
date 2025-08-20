import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsForm } from '../../features/auth/model/settingsForm.interface';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  authService = inject(AuthService);
  store = inject(authStore);
  router = inject(Router);

  settingsForm: FormGroup<SettingsForm>;
  errorMessage = signal('');

  constructor() {
    this.settingsForm = new FormGroup<SettingsForm>({
      image: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      bio: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
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

  onLogout(): void {
    this.authService.logout();
  }

  onSubmit() {
    this.authService
      .update({
        image: this.settingsForm.value.image!,
        username: this.settingsForm.value.username!,
        bio: this.settingsForm.value.bio!,
        email: this.settingsForm.value.email!,
      })
      .subscribe({
        next: ({ user }) => {
          this.router.navigate(['/profile/', user.username]);
        },
        error: (error) => {
          this.authService.errorMessage.set(error.error.message);
        },
      });
  }
}
