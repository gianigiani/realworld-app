import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from '../../entities/comment/comment';
import { Article } from '../../features/article/model/article.model';
import { ArticleService } from '../../features/article/service/article.service';
import { authStore } from '../../features/auth/store/auth.store';
import { Comment } from '../../features/comments/model/comment.interface';
import { CommentsService } from '../../features/comments/service/comments.service';
import { ErrorService } from '../../features/errors/service/error.service';
import { ProfileService } from '../../features/profile/profile.service';

@Component({
  selector: 'app-article',
  imports: [ReactiveFormsModule, CommentComponent, DatePipe],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class ArticleComponent {
  private articleService = inject(ArticleService);
  private commentsService = inject(CommentsService);
  private route = inject(ActivatedRoute);
  private store = inject(authStore);
  private profileService = inject(ProfileService);
  private errorService = inject(ErrorService);

  article = signal<Article | null>(null);
  comments = signal<Comment[]>([]);
  isUser = signal<boolean>(false);
  errorMsg = signal<string>('');

  username = this.store.currentUser()?.username;

  commentForm = new FormGroup({
    comment: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(1)],
      nonNullable: true,
    }),
  });

  constructor() {
    const slug = this.route.snapshot.params['slug'];

    // effect(() => {
    this.getArticle(slug);
    this.getAllCommentsForArticle(slug);
    // });
  }

  getAllCommentsForArticle(slug: string) {
    this.commentsService.getAllComments(slug).subscribe((result: Comment[]) => {
      this.comments.set(result);
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
    const slug = this.article()!.slug;
    const controlCommentValue = this.commentForm.value.comment!;

    this.commentsService.createComment(slug, controlCommentValue).subscribe({
      next: () => {
        this.getAllCommentsForArticle(slug);
        this.commentForm.reset();
      },
      error: (error) => {
        this.errorMsg.set(error);
      },
    });
  }
}
