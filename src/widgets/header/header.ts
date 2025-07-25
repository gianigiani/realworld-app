import { Component, inject, signal } from '@angular/core';
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

  currentUser = signal({ username: 'Guest', image: '' });
}
