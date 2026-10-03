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
        _id: null,
        names: null,
        surnames: null,
        email: null,
        cart: {
          _id: '',
          items: [],
        },
        wishlist: [],
      },
      jwt: '',
    };

    this.loadUser();
  }

  private loadUser(): void {
    const auth = localStorage.getItem('auth');
    if (auth) {
      this.auth = JSON.parse(auth);
    }
    // user not identified;
  }

  public updateWishlist(wishlist: string[]): void {
    this.auth.user.wishlist = [...wishlist];
    localStorage.setItem('auth', JSON.stringify(this.auth));
  }

  public getUser(): Auth {
    return this.auth;
  }

  public refreshUser(): void {
    this.loadUser();
  }

  public update(user: any): void {
    this.auth.user = user;
    localStorage.setItem('auth', JSON.stringify(this.auth));
  }

  public isAuthenticated(): boolean {
    return this.auth.jwt !== '';
  }
}
