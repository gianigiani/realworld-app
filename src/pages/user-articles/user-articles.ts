import { Component, signal } from '@angular/core';
import { ArticlesList } from '../../entities/article/articles-list/articles-list';
import { Article } from '../../features/article/model/article.model';

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
