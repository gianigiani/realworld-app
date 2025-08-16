import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../features/auth/service/auth.service';
import { Footer } from '../widgets/footer/footer';
import { Header } from '../widgets/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.authService.getToken()) {
        this.authService.getCurrentUser().subscribe();
      }
    });
  }
}
