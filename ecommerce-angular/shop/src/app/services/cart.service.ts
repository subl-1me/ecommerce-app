import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { GLOBAL } from '../services/CONST';

import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public headers: HttpHeaders;

  constructor(private _http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  public addItem(cartId: string, itemId: string): Observable<any> {
    return this._http.put(
      `${environment.API_URL || GLOBAL.localUrl}cart/${cartId}/${itemId}`,
      { body: { amount: 1, size: 'M' } },
      {
        headers: this.headers,
      },
    );
  }

  public createCart(): Observable<any> {
    return this._http.post((environment.API_URL || GLOBAL.localUrl) + 'cart', {
      headers: this.headers,
    });
  }

  public getCart(customerID: string): Observable<any> {
    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) + 'cart/' + customerID,
      { headers: this.headers },
    );
  }

  public removeProductCart(registerID: string): Observable<any> {
    return this._http.delete(
      (environment.API_URL || GLOBAL.localUrl) + 'cart/' + registerID,
      { headers: this.headers },
    );
  }
}
