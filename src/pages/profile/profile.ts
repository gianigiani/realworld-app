import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { map } from 'rxjs';
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

  toggleFollowing() {
    if (this.currentUser()) {
      if (!this.profile().following) {
        this.profileService.followUser(this.profile().username).subscribe();
        // TODO:
        // this.getUser(this.route.snapshot.params['username']),
      } else {
        this.profileService.unfollowUser(this.profile().username).subscribe();
        // TODO:
        // this.getUser(this.route.snapshot.params['username']),
      }
    }
  }
}
