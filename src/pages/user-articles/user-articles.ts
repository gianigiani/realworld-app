import { Component } from '@angular/core';
import { ArticlesList } from '../../entities/article/articles-list/articles-list';

@Component({
  selector: 'app-user-articles',
  imports: [ArticlesList],
  templateUrl: './user-articles.html',
  styleUrl: './user-articles.scss',
})
export class UserArticles {
  // articles = signal<Article[]>([]);
}
