import { Component, inject } from '@angular/core';
import { AuthService } from '../../features/auth/api/auth.service';
import { AppAuthDirective } from '../../features/auth/app-auth';

@Component({
  selector: 'app-header',
  imports: [AppAuthDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated();
  currentUser = this.authService.currentUser;
}
