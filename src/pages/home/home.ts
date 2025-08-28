import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticlesList } from '../../entities/article/articles-list/articles-list';
import { ArticleService } from '../../features/article/service/article.service';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';
import { ErrorService } from '../../features/errors/service/error.service';
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
  errorService = inject(ErrorService);
  private authService = inject(AuthService);

  type = signal<string>('global');

  articles = computed(() => this.articlesResource.value()?.articles ?? []);
  error = computed(() => this.articlesResource.error() as HttpErrorResponse);
  errorMsg = computed(() => this.errorService.setErrorMssage(this.error()));
  isLoading = computed(() => this.articlesResource.isLoading());
  private user = computed(
    () => this.authService.getCurrentUserResource.value()?.user,
  );

  tags = computed(() => this.tagsService.tags());

  currentPage = signal(1);
  pageSize = signal(5);

  articlesResource = this.articleService.getArticles(this.type);

  populateGlobalArticles() {
    this.type.set('global');
  }

  populateFeedArticles() {
    if (this.user()) {
      this.type.set('feed');
    } else {
      this.router.navigate(['/login']);
    }
  }
}
