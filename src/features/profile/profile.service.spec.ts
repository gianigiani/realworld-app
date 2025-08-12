import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    profileService = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(profileService).toBeTruthy();
  });
});
