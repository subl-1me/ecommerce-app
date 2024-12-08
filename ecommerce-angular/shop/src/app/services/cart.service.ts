import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { GLOBAL } from '../services/CONST';

import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private _http: HttpClient) {}

  public addProductTCart(cart: Cart): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'cart',
      cart,
      {
        headers: headers,
      }
    );
  }

  public getCart(customerID: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) + 'cart/' + customerID,
      { headers: headers }
    );
  }

  public removeProductCart(registerID: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.delete(
      (environment.API_URL || GLOBAL.localUrl) + 'cart/' + registerID,
      { headers: headers }
    );
  }
}
