import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ArticleService } from '../../../features/article/service/article.service';
import { ErrorService } from '../../../features/errors/service/error.service';
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner';
import { PaginationService } from '../../../shared/pagination-service/pagination.service';
import { ArticlePreview } from '../article-preview/article-preview';

@Component({
  selector: 'app-articles-list',
  imports: [ArticlePreview, LoadingSpinner],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
})
export class ArticlesList {
  private paginationService = inject(PaginationService);
  private errorService = inject(ErrorService);
  private articleService = inject(ArticleService);

  currentPage = signal(1);
  pageSize = signal(5);

  totalPages = computed(() =>
    Math.ceil(this.articlesCount() / this.pageSize()),
  );

  articlesResource = this.articleService.getArticlePerPage(
    this.articleService.type,
    this.currentPage,
  );

  articles = computed(() => this.articlesResource.value()?.articles ?? []);
  articlesCount = computed(
    () => this.articlesResource.value()?.articlesCount ?? 0,
  );
  error = computed(() => this.articlesResource.error() as HttpErrorResponse);
  errorMsg = computed(() => this.errorService.setErrorMessage(this.error()));
  isLoading = computed(() => this.articlesResource.isLoading());

  getVisiblePages = computed(() =>
    this.paginationService.getVisiblePages(
      this.currentPage(),
      this.totalPages(),
    ),
  );

  goToPage(page: number | string) {
    if (typeof page === 'string') {
      return;
    }
    this.currentPage.set(page);
  }
}
