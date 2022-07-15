import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private _http: HttpClient
  ) { }

  public getProducts(filter:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'products/'+filter, {headers: headers});
  }

  public getProductById(productID:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'product/'+productID, {headers: headers});
  }

  public getProductsByCategory(category:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'productsByCategory/'+category, {headers: headers});
  }

  public getLatestProducts():Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    return this._http.get(GLOBAL.url+'latestsProducts', {headers: headers});

  }

  public getTopSellers():Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'topSellers', {headers: headers});
  }
}
