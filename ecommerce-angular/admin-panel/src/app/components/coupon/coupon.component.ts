import { Component, OnInit } from '@angular/core';

import { Coupon } from '../../models/coupon';

import { CouponsService } from 'src/app/services/coupons.service';
import { IdentityService } from 'src/app/services/identity.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css'],
  providers: [ CouponsService, IdentityService ]
})
export class CouponComponent implements OnInit {

  // Icons
  faTrash = faTrash;
  faAdd = faAdd;

  public coupons = Array<Coupon>();
  public token: any;
  public responseMessage: String;

  constructor(
    private _couponService: CouponsService,
    private _identityService: IdentityService
  ) { 
    this.coupons = [];
    this.token = this._identityService.getToken();
    this.responseMessage = '';
  }

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons():void{
    this._couponService.coupons(this.token).subscribe((response) => {
      if(!response.coupons){
        this.responseMessage = response.message;
        return;
      }

      this.responseMessage = '';
      console.log(response);
      this.coupons = response.coupons;
    })
  }

  addSuccess(event:any):void{
    if(!event) return;

    this.getCoupons();
  }

  remove(couponID:any):void{
    if(!couponID) return;

    this._couponService.remove(this.token, couponID).subscribe((response) => {
      this.getCoupons();
      if(response.message !== 'success') return;

    })
  }

}
