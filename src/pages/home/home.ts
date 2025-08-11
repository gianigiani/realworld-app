import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Article } from '../../features/article/model/article.model';
import { ArticleService } from '../../features/article/service/article.service';
import { TagsService } from '../../features/tags/service/tags.service';

@Component({
  selector: 'app-home',
  imports: [DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  tagsService = inject(TagsService);
  articleService = inject(ArticleService);
  tags = signal<string[]>([]);
  articles = signal<Article[]>([]);

  constructor() {
    effect(() => {
      this.tagsService.getAllTags().subscribe((result: string[]) => {
        this.tags.set(result);
      });
      this.articleService.getAllArticles().subscribe((result: Article[]) => {
        this.articles.set(result);
      });
    });
  }
}
