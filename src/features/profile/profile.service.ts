import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { map } from 'rxjs';
import { Profile } from './model/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(username: Signal<string>) {
    return httpResource<{ profile: Profile }>(() =>
      username() ? `/profiles/${username()}` : undefined,
    );
  }

  followUser(username: string) {
    return this.http
      .post<{ profile: Profile }>('/profiles/' + username + '/follow', {})
      .pipe(map((data: { profile: Profile }) => data.profile));
  }

  unfollowUser(username: string) {
    return this.http
      .delete<{ profile: Profile }>('/profiles/' + username + '/follow')
      .pipe(map((data: { profile: Profile }) => data.profile));
  }
}

// this.errorService.setErrorMssage(errorRes);
