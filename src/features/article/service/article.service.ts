import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from '../../errors/service/error.service';
import { Article } from '../model/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  getAllArticles(): Observable<Article[]> {
    return this.http.get<{ articles: Article[] }>('/articles').pipe(
      map((data) => data.articles),
      catchError(this.errorService.handleError.bind(this)),
    );
  }

  getFeedArticles(): Observable<Article[]> {
    return this.http.get<{ articles: Article[] }>('/articles/feed').pipe(
      map((data) => data.articles),
      catchError(this.errorService.handleError.bind(this)),
    );
  }

  getArticle(slug: string): Observable<Article> {
    return this.http.get<{ article: Article }>(`/articles/${slug}`).pipe(
      map((data) => data.article),
      catchError(this.errorService.handleError.bind(this)),
    );
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http
      .post<{ article: Article }>('/articles', { article: article })
      .pipe(
        map((data) => data.article),
        catchError(this.errorService.handleError.bind(this)),
      );
  }
}
