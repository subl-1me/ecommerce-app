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
  private headers: HttpHeaders;
  constructor(private _http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  public list(token: any, filter?: string, value?: string): Observable<any> {
    this.setToken(token);
    let endpoint = constans.endpointsAux.customer.list;
    if (filter && value) {
      endpoint = endpoint
        .replace('${filter}', filter)
        .replace('${value}', value);
    } else {
      endpoint = endpoint.replace('/${filter}', '').replace('/${value}', '');
    }

    return this._http.get(
      `${environment.API_URL || constans.defaultUrl}${endpoint}`,
      {
        headers: this.headers,
      },
    );
  }

  public listById(id: string, token: string): Observable<any> {
    this.setToken(token);
    const endpoint = constans.endpointsAux.customer.getById.replace(
      '${id}',
      id,
    );
    return this._http.get(
      `${environment.API_URL || constans.defaultUrl}${endpoint}`,
      { headers: this.headers },
    );
  }

  public filterBy(filter: string, value: string, token: any): Observable<any> {
    this.setToken(token);
    return this._http.get(
      `${environment.API_URL || constans.defaultUrl}customers/${filter}/${value}`,
      { headers: this.headers },
    );
  }

  public create(customer: Customer, token: any): Observable<any> {
    this.setToken(token);
    return this._http.post(
      `${environment.API_URL || constans.defaultUrl}create`,
      customer,
      { headers: this.headers },
    );
  }

  public edit(id: string, customer: Customer, token: string): Observable<any> {
    this.setToken(token);
    const endpoint = constans.endpointsAux.customer.editById.replace(
      '${id}',
      id,
    );
    return this._http.put(
      `${environment.API_URL || constans.defaultUrl}${endpoint}`,
      customer,
      { headers: this.headers },
    );
  }

  public remove(id: string, token: string): Observable<any> {
    this.setToken(token);
    const endpoint = constans.endpointsAux.customer.removeById.replace(
      '${id}',
      id,
    );
    return this._http.delete(
      `${environment.API_URL || constans.defaultUrl}${endpoint}`,
      { headers: this.headers },
    );
  }

  private setToken(token: string): void {
    this.headers = this.headers.set('Authorization', token);
  }
}
