import { Component, OnInit } from '@angular/core';

// services
import { IdentityService } from 'src/app/services/identity.service';

// Icons
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faGift } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  providers: [ IdentityService ]
})
export class SideBarComponent implements OnInit {

  // Icons
  faHouse = faHouse;
  faUserLarge = faUserLarge;
  faTag = faTag;
  faGift= faGift;
  faGear = faGear;

  constructor(
    private _identityService: IdentityService
  ) { }

  ngOnInit(): void {
  }

  logout():void{
    this._identityService.logout();
  }

}
