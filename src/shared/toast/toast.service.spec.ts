import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToasterService', () => {
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    toastService = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(toastService).toBeTruthy();
  });
});
