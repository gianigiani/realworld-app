import { Component, computed, input, signal } from '@angular/core';
import { Article } from '../../features/article/model/article.model';
import { ArticlePreview } from '../article-preview/article-preview';

@Component({
  selector: 'app-articles-list',
  imports: [ArticlePreview],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
})
export class ArticlesList {
  articles = input.required<Article[]>();
  currentPage = signal(1);
  pageSize = signal(5);

  totalPages = computed(() =>
    Math.ceil(this.articles().length / this.pageSize()),
  );

  paginatedArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.articles().slice(start, start + this.pageSize());
  });

  pages = computed(() => {
    const total = this.totalPages();
    const pageNumbers = [];

    for (let i = 1; i <= total; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  });

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
