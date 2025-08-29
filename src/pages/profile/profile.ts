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

@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
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
  errorMsg = computed(() => this.errorService.setErrorMssage(this.error()));

  profileResource = this.profileService.getProfile(this.username);

  isFollowing = linkedSignal({
    source: () => this.profile()?.following,
    computation: (following) => following,
  });

  toggleFollowing() {
    // TODO: with subscribe
    const isFollowing = this.isFollowing();
    const user = this.profile().username;

    if (isFollowing) {
      this.profileService.unfollowUser(user);
    } else {
      this.profileService.followUser(user);
    }
    this.isFollowing.set(!isFollowing);

    // this.isLoadingFollow.set(true);
    // const username = this.profile().username;
    // of(!!this.currentUser())
    //   .pipe(
    //     switchMap((isAuth: boolean) => {
    //       if (!isAuth) {
    //         void this.router.navigate(['/login']);
    //         return EMPTY;
    //       }
    //       if (!this.isFollowing()) {
    //         return this.profileService.followUser(username);
    //       } else {
    //         return this.profileService.unfollowUser(username);
    //       }
    //     }),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe({
    //     next: () => {
    //       // this.isLoadingFollow.set(false);
    //     },
    //     error: () => console.log("jnds");
    //       //  this.isLoadingFollow.set(false),
    //   });
  }
}
