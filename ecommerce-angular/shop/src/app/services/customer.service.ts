import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from '../services/CONST';
import { Customer } from '../models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private _http: HttpClient) {}

  public register(customer: Customer): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'customer/register',
      customer,
      { headers: headers }
    );
  }

  public login(customer: Customer): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      environment.API_URL || GLOBAL.localUrl + 'customer/login',
      customer,
      { headers: headers }
    );
  }

  public getCustomerById(_id: string): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'customer/' + _id,
      { headers: headers }
    );
  }

  public editProfile(_id: string, customer: Customer): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(
      environment.API_URL || GLOBAL.localUrl + 'customer/' + _id,
      customer,
      { headers: headers }
    );
  }
}
