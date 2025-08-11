import { TestBed } from '@angular/core/testing';

import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let articleService: ArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    articleService = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(articleService).toBeTruthy();
  });
});
