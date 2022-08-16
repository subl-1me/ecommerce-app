import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private _http: HttpClient
  ) { }

  public add(customerId: any, productId:any):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    var data = {
      customer: customerId,
      product: productId
    }

    return this._http.post(GLOBAL.url+'wishlist', data, {headers: headers});
  }

  public items(customerId:any):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'wishlist/'+customerId, {headers: headers});
  }

  public remove(customerId:any, productId:any):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');


    return this._http.delete(GLOBAL.url+'wishlist/'+customerId+'/'+productId, {headers: headers});
  }
}
