import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
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
  profile = signal<Profile | null>(null);
  isUser = signal<boolean>(false);

  username = this.store.currentUser()?.username;

  constructor() {
    this.getUser(this.route.snapshot.params['username']);
  }

  getUser(username: string) {
    this.profileService
      .getUserProfile(username)
      .subscribe((result: Profile) => {
        this.profile.set(result);

        this.isUser.set(this.username === result?.username);
      });
  }

  toggleFollowing() {
    if (this.store.isAuthenticated()) {
      if (!this.profile()?.following) {
        this.profileService
          .followUser(this.profile()!.username)
          .subscribe(() =>
            this.getUser(this.route.snapshot.params['username']),
          );
      } else {
        this.profileService
          .unfollowUser(this.profile()!.username)
          .subscribe(() =>
            this.getUser(this.route.snapshot.params['username']),
          );
      }
    }
  }
}
