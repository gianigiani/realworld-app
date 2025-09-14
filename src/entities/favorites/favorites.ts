import { Component } from '@angular/core';
import { ArticlesList } from '../article/articles-list/articles-list';

@Component({
  selector: 'app-favorites',
  imports: [ArticlesList],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {}
