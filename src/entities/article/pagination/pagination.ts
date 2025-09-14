import { Component, computed, inject, input } from '@angular/core';
import { Article } from '../../../features/article/model/article.model';
import { PaginationService } from '../../../shared/pagination-service/pagination.service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  private paginationService = inject(PaginationService);

  articles = input.required<Article[]>();
  isLoading = input.required<boolean>();
  articlesCount = input.required<number>();

  currentPage = computed(() => this.paginationService.currentPage());
  pageSize = computed(() => this.paginationService.pageSize());

  totalPages = computed(() =>
    Math.ceil(this.articlesCount() / this.pageSize()),
  );

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
    this.paginationService.currentPage.set(page);
  }
}
