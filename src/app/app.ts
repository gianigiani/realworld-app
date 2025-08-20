import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../features/auth/service/auth.service';
import { authStore } from '../features/auth/store/auth.store';
import { LoadingSpinner } from '../shared/loading-spinner/loading-spinner';
import { Footer } from '../widgets/footer/footer';
import { Header } from '../widgets/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);
  store = inject(authStore);

  constructor() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getCurrentUser().subscribe();
    }
  }
}
