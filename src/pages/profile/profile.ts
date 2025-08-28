import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';
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
  destroyRef = inject(DestroyRef);

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
  profileResource = this.profileService.getProfile(this.username);

  // isFollowing = computed(() => this.profile().following);
  follow = signal<boolean>(false);
  isLoadingFollow = signal<boolean>(false);

  isFollowing = linkedSignal({
    source: () => this.profile()?.following,
    computation: (following) => !following,
  });

  constructor() {
    effect(() => {
      const triggerValue = this.isLoadingFollow();
      console.log(triggerValue);

      if (triggerValue) {
        this.profileResource = this.profileService.getProfile(this.username);
      }
    });
  }

  toggleFollowing() {
    this.isLoadingFollow.set(true);
    const username = this.profile().username;

    of(!!this.currentUser())
      .pipe(
        switchMap((isAuth: boolean) => {
          if (!isAuth) {
            void this.router.navigate(['/login']);
            return EMPTY;
          }

          if (!this.isFollowing()) {
            return this.profileService.followUser(username);
          } else {
            return this.profileService.unfollowUser(username);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isLoadingFollow.set(false);
        },
        error: () => this.isLoadingFollow.set(false),
      });
  }
}
