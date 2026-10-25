import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import Auth from '../models/auth';
import { constans } from './const';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private auth: Auth = this.loadAuthSync();

  constructor(private _router: Router) {}

  public getAuth(): Auth {
    return this.auth;
  }

  public isAuthenticated(): boolean {
    if (!constans.allowRoles.includes(this.auth.admin.role)) return false;
    if (this.auth.jwt === '') return false;
    const decoded = this.jwtHelper.decodeToken(this.auth.jwt);
    if (!decoded) return false;
    return true;
  }

  private loadAuthSync(): Auth {
    const raw = localStorage.getItem('auth');
    if (!raw) {
      return { jwt: '', admin: { role: '', email: '', username: '' } };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { jwt: '', admin: { role: '', email: '', username: '' } };
    }
  }

  public logout() {
    localStorage.removeItem('auth');
    this._router.navigate(['/login']);
  }
}
