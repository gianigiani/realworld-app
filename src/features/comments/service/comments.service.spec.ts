import { TestBed } from '@angular/core/testing';

import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let commentsService: CommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    commentsService = TestBed.inject(CommentsService);
  });

  it('should be created', () => {
    expect(commentsService).toBeTruthy();
  });
});
