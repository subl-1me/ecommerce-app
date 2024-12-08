import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Coupon } from '../models/coupon';
import { constans } from './const';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  constructor(private _http: HttpClient) {}

  coupons(token: string): Observable<any> {
    var headersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'coupons',
      { headers: headersAuth }
    );
  }

  add(token: string, coupon: Coupon): Observable<any> {
    var headersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'coupon',
      coupon,
      {
        headers: headersAuth,
      }
    );
  }

  remove(token: string, couponID: string): Observable<any> {
    {
      var headersAuth = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      });

      return this._http.delete(
        (environment.API_URL || constans.defaultUrl) + 'coupon/' + couponID,
        {
          headers: headersAuth,
        }
      );
    }
  }
}
