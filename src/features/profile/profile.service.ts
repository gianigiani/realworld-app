import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ErrorService } from '../errors/service/error.service';
import { Profile } from './model/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  getProfile(username: Signal<string>) {
    return httpResource<{ profile: Profile }>(() =>
      username() ? `/profiles/${username()}` : undefined,
    );
  }

  followUser(username: string) {
    this.http
      .post<{ profile: Profile }>('/profiles/' + username + '/follow', {})
      .pipe(
        map((data: { profile: Profile }) => data.profile),
        catchError((errorRes: HttpErrorResponse) => {
          this.errorService.setErrorMssage(errorRes);
          return throwError(() => errorRes);
        }),
      )
      .subscribe();
  }

  unfollowUser(username: string) {
    this.http
      .delete<{ profile: Profile }>('/profiles/' + username + '/follow')
      .pipe(
        map((data: { profile: Profile }) => data.profile),
        catchError((errorRes: HttpErrorResponse) => {
          this.errorService.setErrorMssage(errorRes);
          return throwError(() => errorRes);
        }),
      )
      .subscribe();
  }
}
