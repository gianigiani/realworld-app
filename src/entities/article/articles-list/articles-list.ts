import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { ArticleService } from '../../../features/article/service/article.service';
import { AuthService } from '../../../features/auth/service/auth.service';
import { ErrorService } from '../../../features/errors/service/error.service';
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner';
import { PaginationService } from '../../../shared/pagination-service/pagination.service';
import { ArticlePreview } from '../article-preview/article-preview';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-articles-list',
  imports: [ArticlePreview, LoadingSpinner, Pagination],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
})
export class ArticlesList {
  private paginationService = inject(PaginationService);
  private errorService = inject(ErrorService);
  private articleService = inject(ArticleService);
  private authService = inject(AuthService);

  private currentUser = computed(
    () => this.authService.getCurrentUserResource.value()?.user.username ?? '',
  );

  articlesResource = this.articleService.getArticlePerPage(
    this.articleService.type,
    this.paginationService.currentPage,
    this.currentUser,
  );

  articles = computed(() => this.articlesResource.value()?.articles ?? []);
  articlesCount = computed(
    () => this.articlesResource.value()?.articlesCount ?? 0,
  );
  error = computed(() => this.articlesResource.error() as HttpErrorResponse);
  errorMsg = computed(() => this.errorService.setErrorMessage(this.error()));
  isLoading = computed(() => this.articlesResource.isLoading());
}
