import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private _http: HttpClient) {}

  public createPaymentIntent(
    amount: number,
    customerID: any,
    paymentMethod: string
  ): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    var data = {
      amount: amount,
      customerID: customerID,
      paymentMethod: paymentMethod,
    };

    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'payment_intent',
      data,
      {
        headers: headers,
      }
    );
  }

  public getActiveOrder(customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) + 'activeOrder/' + customerId,
      {
        headers: headers,
      }
    );
  }

  public generateOrder(orderData: any): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'order',
      orderData,
      {
        headers: headers,
      }
    );
  }

  public sendPayment(orderID: string, token: string): Promise<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http
      .patch(
        (environment.API_URL || GLOBAL.localUrl) + 'order/' + orderID,
        { token: token },
        { headers: headers }
      )
      .toPromise();
  }

  public confirmOrder(orderId: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.patch(
      (environment.API_URL || GLOBAL.localUrl) + 'order/confirm/' + orderId,
      {
        headers: headers,
      }
    );
  }

  public getOrder(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get((environment.API_URL || GLOBAL.localUrl) + 'order');
  }
}
