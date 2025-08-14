import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from '../errors/service/error.service';
import { Profile } from './model/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  getUserProfile(username: string): Observable<Profile> {
    return this.http.get<{ profile: Profile }>('/profiles/' + username).pipe(
      map((data) => data.profile),
      catchError(this.errorService.handleError.bind(this)),
    );
  }

  followUser(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>('/profiles/' + username + '/follow', {})
      .pipe(
        map((data: { profile: Profile }) => data.profile),
        catchError(this.errorService.handleError.bind(this)),
      );
  }

  unfollowUser(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>('/profiles/' + username + '/follow')
      .pipe(
        map((data: { profile: Profile }) => data.profile),
        catchError(this.errorService.handleError.bind(this)),
      );
  }
}
