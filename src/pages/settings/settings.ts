import { Component, inject } from '@angular/core';
import { AuthService } from '../../features/auth/api/auth.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
