import { Component, effect, inject, signal } from '@angular/core';
import { TagsService } from '../../features/tags/service/tags.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  tagsService = inject(TagsService);
  tags = signal<string[]>([]);

  constructor() {
    effect(() => {
      this.tagsService.getAllTags().subscribe((result: string[]) => {
        this.tags.set(result);
      });
    });
  }
}
