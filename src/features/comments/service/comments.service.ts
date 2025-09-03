import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ErrorService } from '../../errors/service/error.service';
import { Comment } from '../model/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  getAllComments(slug: Signal<string>) {
    return httpResource<{ comments: Comment[] }>(() =>
      slug() ? `/articles/${slug()}/comments` : undefined,
    );
  }

  createComment(slug: string, payload: string): Observable<Comment> {
    return this.http
      .post<{ comment: Comment }>(`/articles/${slug}/comments`, {
        comment: { body: payload },
      })
      .pipe(map((data) => data.comment));
  }
}
