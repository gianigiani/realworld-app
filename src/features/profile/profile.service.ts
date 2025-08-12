import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Profile } from './model/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getUserProfile(username: string): Observable<Profile> {
    return this.http.get<{ profile: Profile }>('/profiles/' + username).pipe(
      map((data) => data.profile),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  followUser(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>('/profiles/' + username + '/follow', {})
      .pipe(
        map((data: { profile: Profile }) => data.profile),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  unfollowUser(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>('/profiles/' + username + '/follow')
      .pipe(
        map((data: { profile: Profile }) => data.profile),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }
}
