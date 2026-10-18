import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CouponInput } from '../models/coupon';
import { constans } from './const';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );

  constructor(private _http: HttpClient) {}

  coupons(token: string): Observable<any> {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'coupons',
      { headers: this.httpHeaders },
    );
  }

  add(token: string, coupon: CouponInput): Observable<any> {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'coupon',
      coupon,
      {
        headers: this.httpHeaders,
      },
    );
  }

  remove(token: string, couponID: string): Observable<any> {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
    return this._http.delete(
      (environment.API_URL || constans.defaultUrl) + 'coupon/' + couponID,
      {
        headers: this.httpHeaders,
      },
    );
  }
}
