import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private token: any;
  private user: any;

  constructor(private _router: Router) {
    this.token = localStorage.getItem('token');
    this.user = {};
  }

  getToken() {
    if (!this.checkToken(this.token)) return null;

    return localStorage.getItem('token');
  }

  isAuthenticated(allowRoles: string[]): boolean {
    const token = localStorage.getItem('token');

    if (!token) return false;

    if (!this.checkToken(token)) return false; // verify is token is valid

    return allowRoles.includes(this.user.role);
  }

  checkToken(token: string): boolean {
    try {
      const decodedUser = this.jwtHelper.decodeToken(token);
      if (decodedUser && decodedUser.sub) {
        this.user = decodedUser;
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('_id');
      return false;
    }
    return true;
  }

  logout() {
    if (!this.getToken()) return;

    localStorage.removeItem('token');
    localStorage.removeItem('_id');

    this._router.navigate(['login']);
  }
}
