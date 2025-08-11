import { TestBed } from '@angular/core/testing';

import { TagsService } from './tags.service';

describe('TagsService', () => {
  let tagsService: TagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    tagsService = TestBed.inject(TagsService);
  });

  it('should be created', () => {
    expect(tagsService).toBeTruthy();
  });
});
