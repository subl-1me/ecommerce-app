import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private _http: HttpClient) {}

  getShippingMethods(): Observable<any> {
    return this._http.get('./assets/shipping.methods.json');
  }

  makeStripePayment(stripeToken: any): Observable<any> {
    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'paymentstripe',
      {
        token: stripeToken,
      }
    );
  }

  getActiveOrder(customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get((environment.API_URL || GLOBAL.localUrl) + 'orders', {
      headers: headers,
    });
  }

  applyCouponCode(code: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) + 'coupon/' + code,
      { headers: headers }
    );
  }
}
