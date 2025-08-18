import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../features/article/model/article.model';
import { ArticleService } from '../../features/article/service/article.service';
import { AuthService } from '../../features/auth/service/auth.service';
import { authStore } from '../../features/auth/store/auth.store';
import { Comment } from '../../features/comments/model/comment.interface';
import { CommentsService } from '../../features/comments/service/comments.service';
import { ProfileService } from '../../features/profile/profile.service';

@Component({
  selector: 'app-article',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class ArticleComponent {
  private articleService = inject(ArticleService);
  private commentsService = inject(CommentsService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private store = inject(authStore);
  private profileService = inject(ProfileService);

  article = signal<Article | null>(null);
  comments = signal<Comment[]>([]);
  isUser = signal<boolean>(false);

  username = this.store.currentUser()?.username;

  commentControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.minLength(1)],
    nonNullable: true,
  });

  constructor() {
    const slug = this.route.snapshot.params['slug'];

    effect(() => {
      this.getArticle(slug);
      this.commentsService
        .getAllComments(slug)
        .subscribe((result: Comment[]) => {
          this.comments.set(result);
        });
    });
  }

  getArticle(slug: string) {
    this.articleService.getArticle(slug).subscribe((result: Article) => {
      this.article.set(result);

      this.isUser.set(this.username === result.author.username);
    });
  }

  toggleFollowing() {
    if (this.store.isAuthenticated()) {
      if (!this.article()!.author.following) {
        this.profileService
          .followUser(this.article()!.author.username)
          .subscribe(() => this.getArticle(this.route.snapshot.params['slug']));
      } else {
        this.profileService
          .unfollowUser(this.article()!.author.username)
          .subscribe(() => this.getArticle(this.route.snapshot.params['slug']));
      }
    }
  }

  addComment() {
    this.commentsService
      .createComment(this.article()!.slug, this.commentControl.value)
      .subscribe({
        next: (comment) => {
          console.log(comment);
        },
        error: (error) => {
          this.authService.errorMessage.set(error.error.message); //TODO: check msg error
        },
      });
  }
}
