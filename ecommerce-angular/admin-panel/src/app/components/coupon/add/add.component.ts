import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Coupon } from 'src/app/models/coupon';

import { CouponsService } from 'src/app/services/coupons.service';
import { IdentityService } from 'src/app/services/identity.service';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [ CouponsService, IdentityService ]
})
export class AddComponent implements OnInit {

  // Icons
  faCircleInfo = faCircleInfo;
  faAdd = faAdd;
  faAngleDown = faAngleDown;

  public coupon: Coupon;
  public token: any;
  public responseMessage: string;

  @Output() addSuccess = new EventEmitter<boolean>();

  constructor(
    private _couponsService: CouponsService,
    private _identityService: IdentityService
  ) { 
    this.coupon = {};
    this.token = _identityService.getToken();
    this.responseMessage = '';
  }

  ngOnInit(): void {
  }

  addCoupon(form:any):void{
    this._couponsService.add(this.token, this.coupon).subscribe((response) => {
      if(!response.coupon) return;

      this.responseMessage = 'success';
      this.addSuccess.emit(true);
      form.reset();
    })
  }

}
