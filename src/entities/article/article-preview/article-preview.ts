import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Article } from '../../../features/article/model/article.model';
import { ArticleService } from '../../../features/article/service/article.service';
import { AuthService } from '../../../features/auth/service/auth.service';
import { ErrorService } from '../../../features/errors/service/error.service';

@Component({
  selector: 'app-article-preview',
  imports: [DatePipe, RouterLink, CommonModule],
  templateUrl: './article-preview.html',
  styleUrl: './article-preview.scss',
})
export class ArticlePreview {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);

  article = input.required<Article>();

  favoritesCount = linkedSignal({
    source: () => this.article().favoritesCount,
    computation: (favoritesCount) => favoritesCount,
  });

  isFavorited = linkedSignal({
    source: () => this.article().favorited,
    computation: (favorited) => favorited,
  });

  toggleFavourite(slug: string) {
    const user = this.authService.getCurrentUserResource.value()?.user;
    const isFavorited = this.isFavorited();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const operation$ = isFavorited
      ? this.articleService.unfavoriteArticle(slug)
      : this.articleService.favoriteArticle(slug);

    operation$.subscribe({
      next: (updatedArticle) => {
        console.log(updatedArticle);

        this.isFavorited.set(updatedArticle.favorited);
        this.favoritesCount.set(updatedArticle.favoritesCount);
      },
      error: (error) => {
        this.errorService.setErrorMessage(error);
      },
    });
  }
}
