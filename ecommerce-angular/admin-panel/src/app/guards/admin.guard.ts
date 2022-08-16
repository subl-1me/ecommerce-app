import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { IdentityService } from '../services/identity.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _identityService: IdentityService
  ){}

  canActivate(): boolean {
    if(!this._identityService.isAuthenticated(['admin'])){

      this._router.navigate(['/login']);
      return false;
    }

    return true;
  }
  
}
