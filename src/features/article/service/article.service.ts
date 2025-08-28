import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ErrorService } from '../../errors/service/error.service';
import { Article } from '../model/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  type = signal<string>('global');

  getArticles(type: Signal<string>) {
    return httpResource<{ articles: Article[] }>(() =>
      type() !== 'global' ? `/articles/feed` : `/articles`,
    );
  }

  getArticle(slug: string): Observable<Article> {
    return this.http.get<{ article: Article }>(`/articles/${slug}`).pipe(
      map((data) => data.article),
      catchError((errorRes: HttpErrorResponse) => {
        this.errorService.setErrorMssage(errorRes);
        return throwError(() => errorRes);
      }),
    );
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http
      .post<{ article: Article }>('/articles', { article: article })
      .pipe(
        map((data) => data.article),
        catchError((errorRes: HttpErrorResponse) => {
          this.errorService.setErrorMssage(errorRes);
          return throwError(() => errorRes);
        }),
      );
  }

  // favoriteArticle(slug: string): Observable<Article> {
  //   return this.http
  //     .post<{
  //       article: Article;
  //     }>(`/articles/${slug}/favorite`)
  //     .pipe(
  //       map((data) => data.article),
  //       catchError((errorRes: HttpErrorResponse) =>
  //         this.errorService.handleError(errorRes),
  //       ),
  //     );
  // }
}
