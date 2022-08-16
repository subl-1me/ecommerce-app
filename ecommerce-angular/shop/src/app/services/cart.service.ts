import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';

import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private _http: HttpClient
  ) { }

  public addProductTCart(cart: Cart):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(GLOBAL.url+'cart', cart, {headers: headers});
  }

  public getCart(customerID: string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'cart/'+customerID, {headers: headers});
  }

  public removeProductCart(registerID:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.delete(GLOBAL.url+'cart/'+registerID, {headers: headers});
  }
}
