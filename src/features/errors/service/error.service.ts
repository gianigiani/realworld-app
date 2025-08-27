import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastService } from '../../../shared/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  toastService = inject(ToastService);

  setErrorMssage(err: HttpErrorResponse): string {
    let errorMessage = '';
    if (err) {
      if (err.error instanceof ErrorEvent) {
        errorMessage = `An error occured: ${err.error.message}`;
      } else {
        const status = err.status;
        if (status === 401) {
          errorMessage = 'You are not authorized to access this data.';
        }
        if (status === 404) {
          errorMessage = 'Data was not found. Try again later.';
        }
        if (status === 422) {
          errorMessage = 'Invalid email or password.';
        }
        if (status > 500 && status < 600) {
          errorMessage =
            "The server isnt't curently working. Please try again later.";
        }
      }
      this.toastService.showError(errorMessage);
    }

    return errorMessage;
  }
}
