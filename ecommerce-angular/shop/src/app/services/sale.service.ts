import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './CONST';

import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private _http: HttpClient
  ) { }

  public registerCustomerSale(sale:Sale):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(GLOBAL.url+'sale', sale, {headers: headers});
  }

  public sendEmailSale(saleId:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');


    return this._http.get(GLOBAL.url+'mail/'+saleId, {headers: headers});
  }
}
