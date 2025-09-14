import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { ArticleService } from '../../features/article/service/article.service';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private articleService = inject(ArticleService);
  // currentPage = signal(1);
  currentPage = linkedSignal({
    source: () => this.articleService.type(),
    computation: () => 1,
  });
  pageSize = signal(5);

  calculateTotalPages = (totalArticles: number, pageSize: number): number => {
    return Math.ceil(totalArticles / pageSize);
  };

  getVisiblePages(
    currentPage: number,
    totalPages: number,
    showPagesAround = 2,
  ): (number | string)[] {
    if (totalPages <= 7) {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const pages: (number | string)[] = [];
    const start = Math.max(2, currentPage - showPagesAround);
    const end = Math.min(totalPages - 1, currentPage + showPagesAround);

    // Always show first page
    pages.push(1);

    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }
}
