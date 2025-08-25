import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

  showError(msg: string) {
    this.toastr.error(msg);
  }
}
