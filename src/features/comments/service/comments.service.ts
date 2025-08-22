import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from '../../errors/service/error.service';
import { Comment } from '../model/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  getAllComments(slug: string): Observable<Comment[]> {
    return this.http
      .get<{ comments: Comment[] }>(`/articles/${slug}/comments`)
      .pipe(
        map((data) => data.comments),
        catchError((errorRes: HttpErrorResponse) =>
          this.errorService.handleError(errorRes),
        ),
      );
  }

  createComment(slug: string, payload: string): Observable<Comment> {
    return this.http
      .post<{ comment: Comment }>(`/articles/${slug}/comments`, {
        comment: { body: payload },
      })
      .pipe(
        map((data) => data.comment),
        catchError((errorRes: HttpErrorResponse) =>
          this.errorService.handleError(errorRes),
        ),
      );
  }
}
