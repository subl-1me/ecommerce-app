import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IdentityService } from 'src/app/services/identity.service';

// Icons
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ IdentityService ]
})
export class HomeComponent implements OnInit {

  faUserLarge = faUserLarge;

  constructor(
    private _identityService: IdentityService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    //this.checkIdentity();
  }

  logout():void{
    this._identityService.logout();
  }

  checkIdentity(){
    if(this._identityService.getToken() != null){
      this._router.navigate(['login']);
    }
  }

}
