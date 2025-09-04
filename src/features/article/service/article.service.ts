import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Article } from '../model/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);

  type = signal<string>('global');

  getArticlePerPage(type: Signal<string>, page: Signal<number>) {
    return httpResource<{ articles: Article[]; articlesCount: number }>(() => {
      const limit = 5;
      const currentType = type();
      const offset = (page() - 1) * limit;

      return currentType === 'global'
        ? `/articles?offset=${offset}&limit=${limit}`
        : `/articles/feed?offset=${offset}&limit=${limit}`;
    });
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
