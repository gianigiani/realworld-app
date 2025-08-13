import { Component, signal } from '@angular/core';
import { Article } from '../../features/article/model/article.model';
import { ArticlesList } from '../../shared/articles-list/articles-list';

@Component({
  selector: 'app-user-articles',
  imports: [ArticlesList],
  templateUrl: './user-articles.html',
  styleUrl: './user-articles.scss',
})
export class UserArticles {
  articles = signal<Article[]>([]);

  //we need a call for articles and a filter for user/author
}
