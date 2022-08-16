import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';


// JWT Helper
const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

  private token: any;
  private user: any;

  constructor(
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.user = {};
   }

  getToken(){
    if(!this.checkToken(this.token)) return null;

    return localStorage.getItem('token');
  }

  isAuthenticated(allowRoles:string[]): boolean{
    const token = localStorage.getItem('token');

    if(!token) return false;

    if(!this.checkToken(token)) return false; // verify is token is valid

    return allowRoles.includes(this.user.role);
  }

  checkToken(token: string): boolean{
    try{
      var decodedUser = jwtHelper.decodeToken(token);

    }catch(err){ // means invalid token
      localStorage.removeItem('token');

      return false;
    }

    this.user = decodedUser;
    return true;
  }

  logout(){
    if(!this.getToken()) return;

    localStorage.removeItem('token');
    localStorage.removeItem('_id');

    this._router.navigate(['login']);
  }
}
