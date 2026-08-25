import { Component } from '@angular/core';

import { IdentityService } from './services/identity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ IdentityService ]
})
export class AppComponent{

  public token: any;

  constructor(
    private _identityService: IdentityService,
  ){
    this.token = this._identityService.getToken();
  }

  public isAuthenticated():boolean{
    return this._identityService.isAuthenticated(['Admin']);
  }


  title = 'admin-panel';
}
