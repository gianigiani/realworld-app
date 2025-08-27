import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from '../../features/article/service/article.service';

import { ArticleForm } from '../../features/editor/model/articleForm.interface';
import { ErrorService } from '../../features/errors/service/error.service';

@Component({
  selector: 'app-editor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  errorService = inject(ErrorService);
  errorMsg = signal<string>('');

  articleForm: FormGroup<ArticleForm> = new FormGroup<ArticleForm>({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    body: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  tagField = new FormControl('');
  tagList = signal<string[]>([]);

  addTag() {
    const tag = this.tagField.value;
    if (tag != null && tag.trim() !== '' && this.tagList().indexOf(tag) < 0) {
      this.tagList.update((currentTags) => [...currentTags, tag.trim()]);
    }

    this.tagField.reset();
  }

  removeTag(tagToRemove: string) {
    this.tagList.update((currentTags) =>
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  }

  onSubmit() {
    this.addTag();

    if (this.articleForm.valid) {
      const formData = {
        ...this.articleForm.value,
        tagList: this.tagList(),
      };

      this.articleService.createArticle(formData).subscribe({
        next: (article) => {
          this.router.navigate(['/article/', article.slug]);
        },
        error: (error) => {
          this.errorMsg.set(error);
        },
      });
    }
  }
}
