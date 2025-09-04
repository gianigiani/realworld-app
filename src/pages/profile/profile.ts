import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';
import { ErrorService } from '../../features/errors/service/error.service';
import { Profile } from '../../features/profile/model/profile.model';
import { ProfileService } from '../../features/profile/profile.service';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, LoadingSpinner],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  store = inject(authStore);
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  private currentUser = computed(
    () => this.authService.getCurrentUserResource.value()?.user.username,
  );
  private username = toSignal(
    this.route.params.pipe(map((params) => params['username'])),
    { initialValue: '' },
  );
  isUser = computed(() => this.username() === this.currentUser());
  profile = computed(
    () => this.profileResource.value()?.profile ?? ({} as Profile),
  );
  error = computed(() => this.profileResource.error() as HttpErrorResponse);
  errorMsg = computed(() => this.errorService.setErrorMessage(this.error()));
  isLoading = computed(() => this.profileResource.isLoading());

  profileResource = this.profileService.getProfile(this.username);

  isFollowing = linkedSignal({
    source: () => this.profile()?.following,
    computation: (following) => following,
  });

  toggleFollowing() {
    const isFollowing = this.isFollowing();
    const user = this.profile().username;

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const operation$ = isFollowing
      ? this.profileService.unfollowUser(user)
      : this.profileService.followUser(user);

    operation$.subscribe({
      next: () => {
        this.isFollowing.set(!isFollowing);
      },
      error: () => {
        // TODO: whats the best practice to handle errors here?
        this.errorMsg();
        // this.errorService.setErrorMessage(error);
      },
    });
  }
}
