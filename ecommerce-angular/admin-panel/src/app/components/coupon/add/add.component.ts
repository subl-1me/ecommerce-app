import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Coupon, CouponInput } from 'src/app/models/coupon';

import { CouponsService } from 'src/app/services/coupons.service';
import { IdentityService } from 'src/app/services/identity.service';
import Auth from 'src/app/models/auth';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [CouponsService, IdentityService],
})
export class AddComponent implements OnInit {
  // Icons
  faCircleInfo = faCircleInfo;
  faAdd = faAdd;
  faAngleDown = faAngleDown;

  public coupon: CouponInput;
  public responseMessage: string;
  public auth: Auth = {
    jwt: '',
    admin: {
      username: '',
      email: '',
      role: '',
    },
  };

  @Output() addSuccess = new EventEmitter<boolean>();

  constructor(
    private _couponsService: CouponsService,
    private _identityService: IdentityService,
  ) {
    this.coupon = {
      addedBy: '',
      code: '',
      limit: 0,
      type: '',
      value: 0,
    };
    this.responseMessage = '';
  }

  ngOnInit(): void {
    this.loadAuthUser();
  }

  private loadAuthUser(): void {
    this.auth = this._identityService.getAuth();
  }

  public async addCoupon(form: any): Promise<void> {
    this.coupon.addedBy = this.auth.admin._id || '';
    const response = await lastValueFrom(
      this._couponsService.add(this.auth.jwt, this.coupon),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    console.log(response);
  }
}
