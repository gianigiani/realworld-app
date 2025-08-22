import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errorMessage = signal('');

  handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'Operation failed. Please try again.';

    if (!errorRes.error || !errorRes.error.errors.body) {
      return throwError(() => errorMsg);
    }

    if (errorRes.error && errorRes.error.errors.body[0]) {
      errorMsg = errorRes.error.errors.body[0];
      this.errorMessage.set(errorMsg);
      // alert(errorMsg);
    }

    return throwError(() => new Error(errorMsg));
  }
}
