import { Component, OnInit } from '@angular/core';

import { Coupon } from '../../models/coupon';

import { CouponsService } from 'src/app/services/coupons.service';
import { IdentityService } from 'src/app/services/identity.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import Auth from 'src/app/models/auth';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css'],
  providers: [CouponsService, IdentityService],
})
export class CouponComponent implements OnInit {
  // Icons
  faTrash = faTrash;
  faAdd = faAdd;

  public coupons: Coupon[] = [];
  public responseMessage: String;
  public auth: Auth = {
    jwt: '',
    admin: {
      username: '',
      email: '',
      role: '',
    },
  };

  constructor(
    private _couponService: CouponsService,
    private _identityService: IdentityService,
  ) {
    this.coupons = [];
    this.responseMessage = '';
  }

  ngOnInit(): void {
    this.loadAuth();
    this.getCoupons();
  }

  private loadAuth(): void {
    this.auth = this._identityService.getAuth();
  }

  public async getCoupons(): Promise<void> {
    const response = await lastValueFrom(
      this._couponService.coupons(this.auth.jwt),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.coupons = response.coupons;
  }

  addSuccess(event: any): void {
    if (!event) return;

    this.getCoupons();
  }

  public async remove(couponId: string): Promise<void> {
    const response = await lastValueFrom(
      this._couponService.remove(this.auth.jwt, couponId),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }
  }
}
