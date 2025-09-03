import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CommentComponent } from '../../entities/comment/comment';
import { Article } from '../../features/article/model/article.model';
import { ArticleService } from '../../features/article/service/article.service';
import { AuthService } from '../../features/auth/service/auth.service';
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
  private authService = inject(AuthService);

  private currentUser = computed(
    () => this.authService.getCurrentUserResource.value()?.user.username,
  );
  private username = computed(
    () => this.articleResource.value()?.article.author.username ?? '',
  );
  isUser = computed(() => this.username() === this.currentUser());

  private slug = toSignal(
    this.route.params.pipe(map((params) => params['slug'])),
    { initialValue: '' },
  );
  article = computed(
    () => this.articleResource.value()?.article ?? ({} as Article),
  );
  comments = computed(
    () => this.commentsResource.value()?.comments ?? ([] as Comment[]),
  );
  errorArticle = computed(
    () => this.articleResource.error() as HttpErrorResponse,
  );
  errorMsgArticle = computed(() =>
    this.errorService.setErrorMessage(this.errorArticle()),
  );
  errorComments = computed(
    () => this.commentsResource.error() as HttpErrorResponse,
  );
  errorMsgComments = computed(() =>
    this.errorService.setErrorMessage(this.errorComments()),
  );

  articleResource = this.articleService.getArticle(this.slug);
  commentsResource = this.commentsService.getAllComments(this.slug);

  commentForm = new FormGroup({
    comment: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(1)],
      nonNullable: true,
    }),
  });

  toggleFollowing() {
    if (this.store.isAuthenticated()) {
      if (!this.article()!.author.following) {
        this.profileService.followUser(this.article()!.author.username);
        // .subscribe
        // () => this.getArticle(this.route.snapshot.params['slug'])
        // ();
      } else {
        this.profileService.unfollowUser(this.article()!.author.username);
        // .subscribe
        // () => this.getArticle(this.route.snapshot.params['slug'])
        // ();
      }
    }
  }

  addComment() {
    const slug = this.article()!.slug;
    const controlCommentValue = this.commentForm.value.comment!;

    this.commentsService.createComment(slug, controlCommentValue).subscribe({
      next: () => {
        // TODO: get all comments again
        // this.getAllCommentsForArticle(slug);
        this.commentForm.reset();
      },
      error: (error) => {
        this.errorService.setErrorMessage(error);
      },
    });
  }
}
