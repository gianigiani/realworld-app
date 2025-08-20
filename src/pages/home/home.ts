import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticlesList } from '../../entities/article/articles-list/articles-list';
import { Article } from '../../features/article/model/article.model';
import { ArticleService } from '../../features/article/service/article.service';
import { authStore } from '../../features/auth/store/auth.store';
import { TagsService } from '../../features/tags/service/tags.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ArticlesList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  tagsService = inject(TagsService);
  articleService = inject(ArticleService);
  store = inject(authStore);
  router = inject(Router);

  tags = signal<string[]>([]);
  articles = signal<Article[]>([]);
  type = signal<string>('global');

  currentPage = signal(1);
  pageSize = signal(5);

  constructor() {
    effect(() => {
      this.tagsService.getAllTags().subscribe((result: string[]) => {
        this.tags.set(result);
      });

      this.populateGlobalArticles();
    });
  }

  populateGlobalArticles() {
    this.articleService.getAllArticles().subscribe((result: Article[]) => {
      this.articles.set(result);
      this.type.set('global');
    });
  }

  populateFeedArticles() {
    if (this.store.isAuthenticated()) {
      this.articleService.getFeedArticles().subscribe((result: Article[]) => {
        this.articles.set(result);
        this.type.set('feed');
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
