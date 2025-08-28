import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { ErrorService } from '../../errors/service/error.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private errorService = inject(ErrorService);

  getAllTagResources = httpResource<{ tags: string[] }>(() => `/tags`);

  tags = computed(() => this.getAllTagResources.value()?.tags ?? []);
  error = computed(() => this.getAllTagResources.error() as HttpErrorResponse);
  errorMsg = computed(() => this.errorService.setErrorMssage(this.error()));
}
