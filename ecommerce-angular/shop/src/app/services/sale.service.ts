import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { GLOBAL } from './CONST';

import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private _http: HttpClient) {}

  public registerCustomerSale(sale: Sale): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      environment.API_URL || GLOBAL.localUrl + 'sale',
      sale,
      { headers: headers }
    );
  }

  public sendEmailSale(saleId: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'mail/' + saleId,
      { headers: headers }
    );
  }

  public getSales(customerID: any): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'sales/' + customerID,
      { headers: headers }
    );
  }

  getSaleDetail(transaction: any): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'sale/' + transaction,
      { headers: headers }
    );
  }
}
