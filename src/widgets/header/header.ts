import { Component, inject } from '@angular/core';
import { AppAuthDirective } from '../../features/auth/app-auth';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';

@Component({
  selector: 'app-header',
  imports: [AppAuthDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);

  store = inject(authStore);
}
