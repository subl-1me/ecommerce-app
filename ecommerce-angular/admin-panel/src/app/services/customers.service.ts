import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { constans } from './const';
import { environment } from 'src/environments/environment';

// Models
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private _http: HttpClient) {}

  list(token: any): Observable<any> {
    // get customers list
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'customers',
      { headers: headers }
    );
  }

  listById(token: any, id: any): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'listById/' + id,
      { headers: headers }
    );
  }

  filterBy(type: string, content: string, token: any): Observable<any> {
    let params = 'filterBy=' + type + '&' + 'content=' + content;
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'list/?' + params,
      { headers: headers }
    );
  }

  create(customer: Customer, token: any): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'create',
      customer,
      { headers: headers }
    );
  }

  edit(customer: Customer, token: any, _id: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.put(
      (environment.API_URL || constans.defaultUrl) + 'edit/' + _id,
      customer,
      { headers: headers }
    );
  }

  remove(token: any, _id: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.delete(
      (environment.API_URL || constans.defaultUrl) + 'remove/' + _id,
      { headers: headers }
    );
  }
}
