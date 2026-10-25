import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';
import { OrderInput } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );
  constructor(private _http: HttpClient) {}

  public getCustomerOrders(customerId: string): Observable<any> {
    return this._http.get(
      `${environment.API_URL || GLOBAL.localUrl}/activeOrder/${customerId}`,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public getOrderById(orderId: string): Observable<any> {
    return this._http.get(
      `${environment.API_URL || GLOBAL.localUrl}/order/${orderId}`,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public createOrder(body: OrderInput): Observable<any> {
    return this._http.post(
      `${environment.API_URL || GLOBAL.localUrl}/order `,
      body,
      { headers: this.httpHeaders },
    );
  }

  public confirmOrder(orderId: string): Observable<any> {
    return this._http.patch(
      `${environment.API_URL || GLOBAL.localUrl}/order/confirm${orderId}`,
      null,
      { headers: this.httpHeaders },
    );
  }
}
