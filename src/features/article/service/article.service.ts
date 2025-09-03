import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    return httpResource<{ articles: Article[] }>(
      () => (type() !== 'global' ? `/articles/feed` : `/articles`),
      //TODO: is this corect?
    );
  }

  getArticle(slug: Signal<string>) {
    return httpResource<{ article: Article }>(() =>
      slug() ? `/articles/${slug()}` : undefined,
    );
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http
      .post<{ article: Article }>('/articles', { article: article })
      .pipe(map((data) => data.article));
  }

  // favoriteArticle(slug: string): Observable<Article> {
  //   return this.http
  //     .post<{
  //       article: Article;
  //     }>(`/articles/${slug}/favorite`)
  //     .pipe(
  //       map((data) => data.article),
  //     );
  // }
}
