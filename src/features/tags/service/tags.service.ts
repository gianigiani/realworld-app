import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private http = inject(HttpClient);

  getAllTags() {
    return this.http.get<{ tags: string[] }>('/tags').pipe(
      map((data) => data.tags),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
