import { Injectable } from '@angular/core';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;

  constructor() {
    this.auth = {
      user: {
        sub: null,
        names: null,
        surnames: null,
        email: null,
      },
      jwt: '',
    };

    this.loadUser();
  }

  private loadUser(): void {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth) {
      this.auth = auth;
    }
    // user not identified;
  }

  public getUser(): Auth {
    return this.auth;
  }

  public refreshUser(): void {
    this.loadUser();
  }

  public isAuthenticated(): boolean {
    return this.auth.jwt !== null;
  }
}
