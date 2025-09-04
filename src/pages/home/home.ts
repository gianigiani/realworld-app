import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticlesList } from '../../entities/article/articles-list/articles-list';
import { ArticleService } from '../../features/article/service/article.service';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';
import { ErrorService } from '../../features/errors/service/error.service';
import { TagsService } from '../../features/tags/service/tags.service';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ArticlesList, LoadingSpinner],
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

  private user = computed(
    () => this.authService.getCurrentUserResource.value()?.user,
  );
  tags = computed(() => this.tagsService.tags());

  populateGlobalArticles() {
    this.articleService.type.set('global');
  }

  populateFeedArticles() {
    if (this.user()) {
      this.articleService.type.set('feed');
    } else {
      this.router.navigate(['/login']);
    }
  }
}
