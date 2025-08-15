import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly key = 'token';

  readonly token = signal<string | null>(this.getFromStorage());

  get(): string | null {
    return this.token();
  }

  set(token: string): void {
    localStorage.setItem(this.key, token);
    this.token.set(token);
  }

  remove(): void {
    localStorage.removeItem(this.key);
    this.token.set(null);
  }

  private getFromStorage(): string | null {
    return localStorage.getItem(this.key);
  }
}
