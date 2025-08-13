import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserArticles } from './user-articles';

describe('UserArticles', () => {
  let component: UserArticles;
  let fixture: ComponentFixture<UserArticles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserArticles],
    }).compileComponents();

    fixture = TestBed.createComponent(UserArticles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
