import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { authStore } from '../../features/auth/store/auth.store';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  store = inject(authStore);
}
