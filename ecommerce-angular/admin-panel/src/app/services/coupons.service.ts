import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Coupon } from '../models/coupon';
import { constans } from './const';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor(
    private _http: HttpClient
  ) { }

  coupons(token:string):Observable<any>{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.get(constans.url+'coupons', {headers: headersAuth});
  }

  add(token:string, coupon: Coupon):Observable<any>{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    
    return this._http.post(constans.url+'coupon', coupon, {headers: headersAuth});
  }

  remove(token:string, couponID:string):Observable<any>{{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    
    return this._http.delete(constans.url+'coupon/'+couponID, {headers: headersAuth});
  }}
}
