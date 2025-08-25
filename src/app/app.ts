import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../features/auth/service/auth.service';
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
  // TODO: Find another way to make sure auto auth happens
  private readonly _authService = inject(AuthService);

  status = computed(() => this._authService.getCurrentUserResource.status());
}
