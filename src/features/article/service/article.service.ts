import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Article } from '../model/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);

  getAllArticles(): Observable<Article[]> {
    return this.http.get<{ articles: Article[] }>('/articles').pipe(
      map((data) => data.articles),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  getFeedArticles(): Observable<Article[]> {
    return this.http.get<{ articles: Article[] }>('/articles/feed').pipe(
      map((data) => data.articles),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
