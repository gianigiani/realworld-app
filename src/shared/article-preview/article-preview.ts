import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../features/article/model/article.model';

@Component({
  selector: 'app-article-preview',
  imports: [DatePipe, RouterLink],
  templateUrl: './article-preview.html',
  styleUrl: './article-preview.scss',
})
export class ArticlePreview {
  article = input.required<Article>();
}
