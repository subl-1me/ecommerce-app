import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private _http: HttpClient
  ) { }

  getShippingMethods():Observable<any>{

    return this._http.get('./assets/shipping.methods.json');
  }

  makeStripePayment(stripeToken:any):Observable<any>{

    return this._http.post(GLOBAL.url+'paymentstripe', {token: stripeToken});
  }

  applyCouponCode(code:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'coupon/'+code, {headers: headers});
  }
}
