import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from './api/auth.service';

@Directive({
  selector: '[appAuth]',
})
export class AppAuthDirective<T> {
  private templateRef = inject(TemplateRef<T>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  public appAuth = input<boolean>(false);
  private hasView = false;

  constructor() {
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      const shouldShow = isAuthenticated === this.appAuth();

      if (shouldShow && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!shouldShow && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
