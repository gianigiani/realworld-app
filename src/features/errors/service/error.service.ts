import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ToastService } from '../../../shared/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  toastService = inject(ToastService);

  handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'Operation failed. Please try again.';

    if (errorRes.error && errorRes.error.message) {
      errorMsg = errorRes.error.message;
    }

    if (errorRes.error && errorRes.error.errors.body[0]) {
      errorMsg = errorRes.error.errors.body[0];
    }

    return throwError(() => {
      this.toastService.showError(errorMsg);
      return new Error(errorMsg);
    });
  }
}
