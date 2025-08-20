import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly key = 'token';

  readonly token = signal<string | null>(this.getFromStorage());

  private getFromStorage(): string | null {
    return localStorage.getItem(this.key);
  }

  set(token: string): void {
    localStorage.setItem(this.key, token);
    this.token.set(token);
  }

  remove(): void {
    localStorage.removeItem(this.key);
    this.token.set(null);
  }

  getValidToken(): string | null {
    const token = this.token();
    if (!token) return null;
    return this.isTokenExpired(token) ? null : token;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp;

      return typeof expiration === 'number' && Date.now() > expiration * 1000;
    } catch {
      return true;
    }
  }
}
