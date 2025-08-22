import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { ErrorService } from '../../errors/service/error.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  getAllTags() {
    return this.http.get<{ tags: string[] }>('/tags').pipe(
      map((data) => data.tags),
      catchError((errorRes: HttpErrorResponse) =>
        this.errorService.handleError(errorRes),
      ),
    );
  }
}
