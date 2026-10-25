import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { GLOBAL } from './CONST';
import StripePaymentIntentInput from '../models/stripePaymentIntentInput';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );

  constructor(private _http: HttpClient) {}

  public createPaymentIntent(body: any): Observable<any> {
    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'payment_intent',
      body,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public getActiveOrder(customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) + 'activeOrder/' + customerId,
      {
        headers: headers,
      },
    );
  }

  public generateOrder(orderData: any): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'order',
      orderData,
      {
        headers: headers,
      },
    );
  }

  public sendPayment(orderID: string, token: string): Promise<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http
      .patch(
        (environment.API_URL || GLOBAL.localUrl) + 'order/' + orderID,
        { token: token },
        { headers: headers },
      )
      .toPromise();
  }

  public confirmOrder(orderId: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.patch(
      (environment.API_URL || GLOBAL.localUrl) + 'order/confirm/' + orderId,
      {
        headers: headers,
      },
    );
  }

  public getOrder(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get((environment.API_URL || GLOBAL.localUrl) + 'order');
  }
}
