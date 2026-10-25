import { Component, OnInit } from '@angular/core';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { CustomerService } from '../../services/customer.service';
import { AuthService } from 'src/app/services/auth.service';
import { Auth } from 'src/app/models/auth';

@Component({
  selector: 'app-profile-list-group',
  templateUrl: './profile-list-group.component.html',
  styleUrls: ['./profile-list-group.component.css'],
  providers: [CustomerService],
})
export class ProfileListGroupComponent implements OnInit {
  public auth: Auth = {
    jwt: '',
    user: null,
  };

  // Icons
  faUser = faUser;
  faMap = faMap;
  faHeart = faHeart;
  faEye = faEye;
  faStar = faStar;
  faGear = faGear;
  faXmark = faXmark;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.loadAuthData();
  }

  private loadAuthData(): void {
    this.auth = this._authService.getUser();
  }
}
